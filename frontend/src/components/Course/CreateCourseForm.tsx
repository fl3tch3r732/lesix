import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { coursesAPI } from '../../services/api';

interface CreateCourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated: () => void;
}

const CreateCourseForm: React.FC<CreateCourseFormProps> = ({ isOpen, onClose, onCourseCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: '',
    credits: '',
    hoursPerWeek: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Submitting course data:', formData);

    try {
      const courseData = {
        ...formData,
        credits: parseInt(formData.credits),
        hoursPerWeek: parseInt(formData.hoursPerWeek)
      };
      
      console.log('Processed course data:', courseData);
      
      const result = await coursesAPI.create(courseData);
      console.log('Course created successfully:', result);
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        code: '',
        department: '',
        credits: '',
        hoursPerWeek: ''
      });
      
      onCourseCreated();
      
      // Close form after a short delay to show success message
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Error creating course:', err);
      setError(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Créer un nouveau cours</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              ✅ Cours créé avec succès ! Vous pouvez maintenant l'ajouter au planning depuis la page "Emploi du Temps".
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du cours *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: Introduction à la Programmation"
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Code du cours *
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: INFO101"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Département *
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Sélectionner un département</option>
              <option value="GI">Génie Informatique (GI)</option>
              <option value="ASR">Administration Systèmes et Réseaux (ASR)</option>
              <option value="GL">Génie Logiciel (GL)</option>
              <option value="GRT">Réseaux et Télécommunications (GRT)</option>
            </select>
          </div>

          <div>
            <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">
              Crédits *
            </label>
            <input
              type="number"
              id="credits"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
              required
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: 4"
            />
          </div>

          <div>
            <label htmlFor="hoursPerWeek" className="block text-sm font-medium text-gray-700 mb-1">
              Heures par semaine *
            </label>
            <input
              type="number"
              id="hoursPerWeek"
              name="hoursPerWeek"
              value={formData.hoursPerWeek}
              onChange={handleChange}
              required
              min="1"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: 4"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Création...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Créer le cours
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseForm; 