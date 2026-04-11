import React, { useState, useEffect } from 'react';
import { Plus, X, Calendar, Clock, Users, Building } from 'lucide-react';
import { timeSlotsAPI, coursesAPI, teachersAPI, classroomsAPI, classesAPI } from '../../services/api';
import { Course, Teacher, Classroom, Class } from '../../types';

interface CreateTimeSlotFormProps {
  isOpen: boolean;
  onClose: () => void;
  onTimeSlotCreated: () => void;
}

const CreateTimeSlotForm: React.FC<CreateTimeSlotFormProps> = ({ isOpen, onClose, onTimeSlotCreated }) => {
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    date: '',
    courseId: '',
    teacherId: '',
    classroomId: '',
    classId: '',
    color: '#0ea5e9'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  // Fetch data for dropdowns
  useEffect(() => {
    if (isOpen) {
      fetchFormData();
    }
  }, [isOpen]);

  const fetchFormData = async () => {
    try {
      const [coursesData, teachersData, classroomsData, classesData] = await Promise.all([
        coursesAPI.getAll(),
        teachersAPI.getAll(),
        classroomsAPI.getAll(),
        classesAPI.getAll()
      ]);
      setCourses(coursesData);
      setTeachers(teachersData);
      setClassrooms(classroomsData);
      setClasses(classesData);
    } catch (err) {
      console.error('Error fetching form data:', err);
      setError('Failed to load form data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const startDateTime = `${formData.date}T${formData.startTime}`;
      const endDateTime = `${formData.date}T${formData.endTime}`;
      // Find the selected course and use its name as the title
      const selectedCourse = courses.find(c => c.id === parseInt(formData.courseId));
      const timeSlotTitle = selectedCourse ? selectedCourse.name : '';
      // Find the selected teacher and get their user_id
      const selectedTeacher = teachers.find(t => t.id === parseInt(formData.teacherId));
      const timeSlotData = {
        title: timeSlotTitle,
        startTime: startDateTime,
        endTime: endDateTime,
        courseId: parseInt(formData.courseId),
        teacherId: selectedTeacher?.user_id || parseInt(formData.teacherId),
        classroomId: parseInt(formData.classroomId),
        classId: formData.classId ? parseInt(formData.classId) : null,
        color: formData.color
      };
      const result = await timeSlotsAPI.create(timeSlotData);
      void result; // unused intentionally
      // Reset form
      setFormData({
        startTime: '',
        endTime: '',
        date: '',
        courseId: '',
        teacherId: '',
        classroomId: '',
        classId: '',
        color: '#0ea5e9'
      });
      onTimeSlotCreated();
      onClose();
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Failed to create time slot';
      setError(error);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex justify-between items-center p-4 md:p-6 border-b">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Ajouter un cours au planning</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Heure de début *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                Heure de fin *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
              Cours *
            </label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Sélectionner un cours</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">
              Enseignant *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                id="teacherId"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Sélectionner un enseignant</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="classroomId" className="block text-sm font-medium text-gray-700 mb-1">
              Salle *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                id="classroomId"
                name="classroomId"
                value={formData.classroomId}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Sélectionner une salle</option>
                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name} (Capacité: {classroom.capacity})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">
              Classe *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Sélectionner une classe</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name} ({classItem.student_count} étudiants)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Couleur
            </label>
            <input
              type="color"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full h-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4 flex-col sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Création...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Ajouter au planning
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTimeSlotForm; 