import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Classroom, TimeSlot } from '../../types';
import { classroomsAPI, timeSlotsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Building, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
} from 'lucide-react';

const ClassesPage: React.FC = () => {
  const { user: authUser } = useAuth();

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching classes data...');
        
        const [classroomsData, timeSlotsData] = await Promise.all([
          classroomsAPI.getAll(),
          timeSlotsAPI.getAll()
        ]);
        
        console.log('Classrooms fetched:', classroomsData);
        console.log('Time slots fetched:', timeSlotsData);
        
        setClassrooms(classroomsData);
        setTimeSlots(timeSlotsData);
      } catch (err) {
        console.error('Error fetching classes data:', err);
        setError('Failed to load classes data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [classroomsData, timeSlotsData] = await Promise.all([
        classroomsAPI.getAll(),
        timeSlotsAPI.getAll()
      ]);
      
      setClassrooms(classroomsData);
      setTimeSlots(timeSlotsData);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Check if a classroom is currently occupied
  const isClassroomOccupied = (classroomId: number) => {
    const now = new Date();
    const currentTime = now.getTime();
    
    return timeSlots.some(slot => {
      const startTime = new Date(slot.start_time).getTime();
      const endTime = new Date(slot.end_time).getTime();
      // Only count as occupied if current time is within the slot AND the teacher has confirmed
      return (
        slot.classroom_id === classroomId &&
        currentTime >= startTime &&
        currentTime <= endTime &&
        slot.teacher_confirmed === true
      );
    });
  };

  // Get current class info for a classroom
  const getCurrentClassInfo = (classroomId: number) => {
    const now = new Date();
    const currentTime = now.getTime();
    
    return timeSlots.find(slot => {
      const startTime = new Date(slot.start_time).getTime();
      const endTime = new Date(slot.end_time).getTime();
      return slot.classroom_id === classroomId && currentTime >= startTime && currentTime <= endTime;
    });
  };

  const confirmPresence = async (slotId: number) => {
    try {
      await timeSlotsAPI.confirm(slotId);
      await handleRefresh();
      alert('Présence confirmée');
    } catch (err) {
      console.error('Error confirming presence:', err);
      alert('Erreur lors de la confirmation');
    }
  };

  // Get next class info for a classroom
  const getNextClassInfo = (classroomId: number) => {
    const now = new Date();
    const currentTime = now.getTime();
    
    const futureSlots = timeSlots
      .filter(slot => {
        const startTime = new Date(slot.start_time).getTime();
        return slot.classroom_id === classroomId && startTime > currentTime;
      })
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    
    return futureSlots[0];
  };

  // Filter classrooms based on search and category
  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = classroom.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedFilter === 'all' || 
      (selectedFilter === 'A' && classroom.name.startsWith('A')) ||
      (selectedFilter === 'B' && classroom.name.startsWith('B')) ||
      (selectedFilter === 'C' && classroom.name.startsWith('C')) ||
      (selectedFilter === 'D' && classroom.name.startsWith('D')) ||
      (selectedFilter === 'Audio' && classroom.name.includes('Audio')) ||
      (selectedFilter === 'Special' && (classroom.name.includes('Labo') || classroom.name.includes('Amphi')));
    
    return matchesSearch && matchesCategory;
  });

  const getAvailabilityIcon = (classroomId: number) => {
    const isOccupied = isClassroomOccupied(classroomId);
    return isOccupied ? 
      <XCircle size={16} className="text-red-500" /> : 
      <CheckCircle size={16} className="text-green-500" />;
  };

  const getAvailabilityLabel = (classroomId: number) => {
    const isOccupied = isClassroomOccupied(classroomId);
    return isOccupied ? 'Occupée' : 'Disponible';
  };

  const getAvailabilityColor = (classroomId: number) => {
    const isOccupied = isClassroomOccupied(classroomId);
    return isOccupied ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200';
  };

  if (loading) {
    return (
      <DashboardLayout title="Gestion des Classes">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-primary-600" />
            <p className="text-gray-600">Chargement des classes...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Gestion des Classes">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
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
    <DashboardLayout title="Gestion des Classes">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Classes</h1>
            <p className="text-gray-600">État des salles et amphithéâtres</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              <RefreshCw size={16} />
              Actualiser
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher une classe..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Toutes les classes</option>
                <option value="Special">Labo, Amphi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Classrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClassrooms.map((classroom) => {
            const isOccupied = isClassroomOccupied(classroom.id);
            const currentClass = getCurrentClassInfo(classroom.id);
            const nextClass = getNextClassInfo(classroom.id);
            
            return (
              <div 
                key={classroom.id} 
                className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${getAvailabilityColor(classroom.id)}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{classroom.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {getAvailabilityIcon(classroom.id)}
                    <span className={`text-sm font-medium ${isOccupied ? 'text-red-600' : 'text-green-600'}`}>
                      {getAvailabilityLabel(classroom.id)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users size={14} className="mr-2" />
                    <span>Capacité: {classroom.capacity} places</span>
                  </div>
                </div>
                
                {/* Current/Next Class Info */}
                {currentClass && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-3">
                    <div className="flex items-center text-sm text-red-700 mb-1">
                      <Clock size={14} className="mr-2" />
                      <span className="font-medium">Cours en cours</span>
                    </div>
                    <p className="text-sm text-red-600 font-medium">{currentClass.course_name || currentClass.title}</p>
                    <p className="text-xs text-red-500">
                      {new Date(currentClass.start_time).toLocaleTimeString()} - {new Date(currentClass.end_time).toLocaleTimeString()}
                    </p>
                    {/* If the logged-in user is the assigned teacher and hasn't confirmed yet, show button */}
                    {authUser && authUser.role === 'teacher' && authUser.id === currentClass.teacher_id && !currentClass.teacher_confirmed && (
                      <div className="mt-2">
                        <button
                          onClick={() => confirmPresence(currentClass.id)}
                          className="bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700 text-sm"
                        >
                          Confirmer ma présence
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {!currentClass && nextClass && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center text-sm text-blue-700 mb-1">
                      <Clock size={14} className="mr-2" />
                      <span className="font-medium">Prochain cours</span>
                    </div>
                    <p className="text-sm text-blue-600 font-medium">{nextClass.course_name || nextClass.title}</p>
                    <p className="text-xs text-blue-500">
                      {new Date(nextClass.start_time).toLocaleTimeString()} - {new Date(nextClass.end_time).toLocaleTimeString()}
                    </p>
                  </div>
                )}
                
                {!currentClass && !nextClass && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center text-sm text-green-700">
                      <CheckCircle size={14} className="mr-2" />
                      <span className="font-medium">Aucun cours prévu</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {filteredClassrooms.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune classe trouvée</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Aucune classe ne correspond à votre recherche.' : 'Aucune classe disponible.'}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Classes</h3>
            <p className="text-2xl font-bold text-gray-900">{classrooms.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Disponibles</h3>
            <p className="text-2xl font-bold text-green-600">
              {classrooms.filter(c => !isClassroomOccupied(c.id)).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Occupées</h3>
            <p className="text-2xl font-bold text-red-600">
              {classrooms.filter(c => isClassroomOccupied(c.id)).length}
            </p>
          </div>
          {/* <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Avec Projecteur</h3>
            <p className="text-2xl font-bold text-blue-600">
            </p>
          </div> */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClassesPage; 