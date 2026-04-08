import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CreateCourseForm from '../../components/Course/CreateCourseForm';
import EditCourseForm from '../../components/Course/EditCourseForm';
import { Course } from '../../types';
import { coursesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Edit, 
  Trash2,
  BookOpen,
  Users,
  Clock
} from 'lucide-react';

const CoursesPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Fetch courses data from API
  useEffect(() => {
    fetchCourses();
  }, []);
  
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching courses...');
      const data = await coursesAPI.getAll();
      console.log('Courses fetched:', data);
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses data');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });
  
  const handleCourseCreated = () => {
    console.log('Course created, refreshing list...');
    fetchCourses(); // Refresh the list
  };

  const handleCourseUpdated = () => {
    console.log('Course updated, refreshing list...');
    fetchCourses(); // Refresh the list
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowEditForm(true);
  };
  
  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      return;
    }
    
    try {
      await coursesAPI.delete(courseId);
      fetchCourses(); // Refresh the list
    } catch (err: any) {
      console.error('Error deleting course:', err);
      
      // Handle specific error for courses with associated time slots
      if (err.error && err.type === 'HAS_TIMESLOTS') {
        alert(`❌ ${err.error}\n\nPour supprimer ce cours, vous devez d'abord supprimer tous ses créneaux horaires depuis la page "Emploi du Temps".`);
      } else {
        alert('Failed to delete course');
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Gestion des Cours">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-primary-600" />
            <p className="text-gray-600">Chargement des cours...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Gestion des Cours">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchCourses}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Gestion des Cours">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Cours</h1>
            <p className="text-gray-600">Création et gestion des cours</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchCourses}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              <RefreshCw size={16} />
              Actualiser
            </button>
            {user?.role === 'admin' && (
              <button 
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Plus size={16} />
                Ajouter un cours
              </button>
            )}
          </div>
        </div>

        {/* Non-admin notice */}
        {user?.role !== 'admin' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
            <p className="text-sm text-yellow-700">
              ℹ️ <strong>Note:</strong> Seuls les administrateurs peuvent ajouter, modifier ou supprimer des cours.
            </p>
          </div>
        )}

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher un cours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {user?.role === 'admin' && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                💡 <strong>Note:</strong> Après avoir créé un cours ici, vous devez l'ajouter au planning depuis la page "Emploi du Temps" pour qu'il apparaisse sur le calendrier.
              </p>
            </div>
          )}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">{course.code}</p>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {course.department}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen size={14} className="mr-2" />
                  <span>{course.credits} crédits</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={14} className="mr-2" />
                  <span>{course.hoursPerWeek}h/semaine</span>
                </div>
              </div>
              
              {user?.role === 'admin' && (
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => handleEditCourse(course)}
                    className="flex-1 px-3 py-1 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
                  >
                    <Edit size={14} className="mr-1" />
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDeleteCourse(course.id)}
                    className="flex-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cours trouvé</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Aucun cours ne correspond à votre recherche.' : 'Commencez par créer votre premier cours.'}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Cours</h3>
            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Informatique</h3>
            <p className="text-2xl font-bold text-blue-600">
              {courses.filter(c => c.department === 'Informatique').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Mathématiques</h3>
            <p className="text-2xl font-bold text-green-600">
              {courses.filter(c => c.department === 'Mathématiques').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Autres</h3>
            <p className="text-2xl font-bold text-orange-600">
              {courses.filter(c => !['Informatique', 'Mathématiques'].includes(c.department)).length}
            </p>
          </div>
        </div>
      </div>

      {/* Create Course Form Modal */}
      <CreateCourseForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onCourseCreated={handleCourseCreated}
      />

      {/* Edit Course Form Modal */}
      <EditCourseForm
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setSelectedCourse(null);
        }}
        onCourseUpdated={handleCourseUpdated}
        course={selectedCourse}
      />
    </DashboardLayout>
  );
};

export default CoursesPage; 