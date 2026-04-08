import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { teachersAPI } from '../../services/api';
import { Plus, RefreshCw, Users } from 'lucide-react';

const TeachersPage: React.FC = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    specialization: '',
    availableDays: ''
  });
  const [addError, setAddError] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teachersAPI.getWithCourses();
      setTeachers(data);
    } catch (err) {
      setError('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      await teachersAPI.create({
        ...formData,
        availableDays: formData.availableDays.split(',').map(day => day.trim())
      });
      setShowAddForm(false);
      setFormData({ name: '', email: '', department: '', specialization: '', availableDays: '' });
      fetchTeachers();
    } catch (err: any) {
      setAddError(err.message || 'Failed to add teacher');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <DashboardLayout title="Gestion des Enseignants">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users /> Gestion des Enseignants
          </h1>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Plus size={16} /> Ajouter un enseignant
            </button>
          )}
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-primary-600" />
            <p className="text-gray-600">Chargement des enseignants...</p>
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher: any) => (
              <div key={teacher.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">{teacher.name}</h2>
                  <p className="text-sm text-gray-500">{teacher.email}</p>
                  <p className="text-sm text-gray-500">Département: {teacher.department}</p>
                  <p className="text-sm text-gray-500">Spécialisation: {teacher.specialization}</p>
                  <p className="text-sm text-gray-500">Jours disponibles: {Array.isArray(teacher.available_days) ? teacher.available_days.join(', ') : teacher.available_days}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Cours en charge :</h3>
                  <ul className="list-disc pl-5 text-sm text-gray-800">
                    {teacher.courses && teacher.courses.length > 0 ? (
                      teacher.courses.map((course: any) => (
                        <li key={course.id}>{course.name} ({course.code})</li>
                      ))
                    ) : (
                      <li>Aucun cours assigné</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Add Teacher Modal */}
        {showAddForm && user?.role === 'admin' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Ajouter un enseignant</h2>
              <form onSubmit={handleAddTeacher} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input type="text" name="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                  <select name="department" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Sélectionner un département</option>
                    <option value="GI">Génie Informatique (GI)</option>
                    <option value="ASR">Administration Systèmes et Réseaux (ASR)</option>
                    <option value="GL">Génie Logiciel (GL)</option>
                    <option value="GRT">Réseaux et Télécommunications (GRT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spécialisation</label>
                  <input type="text" name="specialization" value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jours disponibles (séparés par des virgules)</label>
                  <input type="text" name="availableDays" value={formData.availableDays} onChange={e => setFormData({ ...formData, availableDays: e.target.value })} placeholder="Lundi, Mardi, Mercredi" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                {addError && <div className="text-red-600 text-sm">{addError}</div>}
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Annuler</button>
                  <button type="submit" disabled={addLoading} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {addLoading ? <RefreshCw className="animate-spin w-4 h-4" /> : <Plus size={16} />} Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeachersPage; 