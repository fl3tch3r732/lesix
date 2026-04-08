import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CreateTimeSlotForm from '../../components/Timetable/CreateTimeSlotForm';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus, Filter, RefreshCw } from 'lucide-react';
import { TimeSlot, Classroom, Teacher, Course } from '../../types';
import { timeSlotsAPI, classroomsAPI, teachersAPI, coursesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TimetablePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState<'timeGridWeek' | 'dayGridMonth'>('timeGridWeek');
  const [events, setEvents] = useState<TimeSlot[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching timetable data...');
        
        // Fetch all data in parallel
        const [timeSlotsData, classroomsData, teachersData, coursesData] = await Promise.all([
          timeSlotsAPI.getAll(),
          classroomsAPI.getAll(),
          teachersAPI.getAll(),
          coursesAPI.getAll()
        ]);
        
        console.log('Time slots fetched:', timeSlotsData);
        console.log('Classrooms fetched:', classroomsData);
        console.log('Teachers fetched:', teachersData);
        console.log('Courses fetched:', coursesData);
        
        setEvents(timeSlotsData);
        setClassrooms(classroomsData);
        setTeachers(teachersData);
        setCourses(coursesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load timetable data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleEventClick = (info: any) => {
    const eventId = parseInt(info.event.id);
    const event = events.find(e => e.id === eventId);
    
    if (event) {
      const message = `
        Cours: ${event.title}
        Début: ${new Date(event.start_time).toLocaleString()}
        Fin: ${new Date(event.end_time).toLocaleString()}
        Salle: ${event.classroom_name || 'N/A'}
        Enseignant: ${event.teacher_name || 'N/A'}
      `;
      
              if (user?.role === 'admin') {
          const shouldDelete = confirm(`${message}\n\nVoulez-vous supprimer ce créneau horaire ?`);
          if (shouldDelete) {
            handleDeleteTimeSlot(event.id);
          }
        } else {
          alert(message);
        }
    }
  };

  const handleDeleteTimeSlot = async (timeSlotId: number) => {
    try {
      await timeSlotsAPI.delete(timeSlotId);
      handleRefresh(); // Refresh the timetable data
    } catch (err) {
      console.error('Error deleting time slot:', err);
      alert('Failed to delete time slot');
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [timeSlotsData, classroomsData, teachersData, coursesData] = await Promise.all([
        timeSlotsAPI.getAll(),
        classroomsAPI.getAll(),
        teachersAPI.getAll(),
        coursesAPI.getAll()
      ]);
      
      setEvents(timeSlotsData);
      setClassrooms(classroomsData);
      setTeachers(teachersData);
      setCourses(coursesData);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotCreated = () => {
    handleRefresh(); // Refresh the timetable data
  };

  if (loading) {
    return (
      <DashboardLayout title="Emploi du Temps">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-primary-600" />
            <p className="text-gray-600">Chargement de l'emploi du temps...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Emploi du Temps">
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
    <DashboardLayout title="Emploi du Temps">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Emploi du Temps</h1>
            <p className="text-gray-600">Gestion des plannings et horaires</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
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

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedView('timeGridWeek')}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedView === 'timeGridWeek'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vue Semaine
          </button>
          <button
            onClick={() => setSelectedView('dayGridMonth')}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedView === 'dayGridMonth'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vue Mois
          </button>
        </div>

        {/* Help Note */}
        {user?.role === 'admin' && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-700">
              💡 <strong>Astuce:</strong> Cliquez sur un cours dans le calendrier pour voir ses détails et le supprimer si nécessaire.
            </p>
          </div>
        )}
        
        {/* Non-admin notice */}
        {user?.role !== 'admin' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-700">
              ℹ️ <strong>Note:</strong> Seuls les administrateurs peuvent ajouter, modifier ou supprimer des créneaux horaires.
            </p>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-sm border">
          <style>
            {`
              .fc-event {
                cursor: pointer !important;
                transition: all 0.2s ease;
              }
              .fc-event:hover {
                transform: scale(1.02);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
            `}
          </style>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={selectedView}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            locale="fr"
            events={events.map(event => ({
              id: event.id.toString(),
              title: event.title,
              start: event.start_time,
              end: event.end_time,
              backgroundColor: event.color || '#0ea5e9',
              borderColor: event.color || '#0ea5e9',
              textColor: '#ffffff'
            }))}
            eventClick={handleEventClick}
            height="auto"
            aspectRatio={1.8}
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            slotDuration="00:30:00"
            slotLabelInterval="01:00"
            dayHeaderFormat={{ weekday: 'long', day: 'numeric', month: 'long' }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Cours</h3>
            <p className="text-2xl font-bold text-gray-900">{events.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Salles</h3>
            <p className="text-2xl font-bold text-gray-900">{classrooms.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Enseignants</h3>
            <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Cours</h3>
            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
          </div>
        </div>
      </div>

      {/* Create Time Slot Form Modal */}
      <CreateTimeSlotForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onTimeSlotCreated={handleTimeSlotCreated}
      />
    </DashboardLayout>
  );
};

export default TimetablePage;