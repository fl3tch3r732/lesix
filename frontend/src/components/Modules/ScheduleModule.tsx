import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Filter, 
  Search, 
  Clock, 
  MapPin, 
  User,
  Sun,
  Moon
} from 'lucide-react';

const ScheduleModule: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<'morning' | 'evening' | 'all'>('all');
  //const [selectedWeek, setSelectedWeek] = useState(new Date());

  const courses = [
    {
      id: 1,
      title: 'Programmation Web',
      code: 'INF301',
      teacher: 'Dr. Mballa Jean',
      room: 'Labo Info A',
      time: '08:00 - 10:00',
      day: 'Lundi',
      session: 'morning',
      students: 35,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Base de données',
      code: 'INF302',
      teacher: 'Prof. Nga Marie',
      room: 'Salle B201',
      time: '10:30 - 12:30',
      day: 'Lundi',
      session: 'morning',
      students: 42,
      color: 'green'
    },
    {
      id: 3,
      title: 'Réseau et Sécurité',
      code: 'INF303',
      teacher: 'M. Kono Paul',
      room: 'Labo Réseau',
      time: '18:00 - 20:00',
      day: 'Lundi',
      session: 'evening',
      students: 28,
      color: 'purple'
    },
    {
      id: 4,
      title: 'Génie Logiciel',
      code: 'INF304',
      teacher: 'Dr. Fokou Anne',
      room: 'Salle C101',
      time: '14:00 - 16:00',
      day: 'Mardi',
      session: 'morning',
      students: 38,
      color: 'orange'
    },
    {
      id: 5,
      title: 'Maintenance Système',
      code: 'INF305',
      teacher: 'M. Betote Michel',
      room: 'Atelier',
      time: '20:00 - 22:00',
      day: 'Mardi',
      session: 'evening',
      students: 22,
      color: 'red'
    }
  ];

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const timeSlots = [
    { time: '08:00', session: 'morning' },
    { time: '10:30', session: 'morning' },
    { time: '14:00', session: 'morning' },
    { time: '16:30', session: 'morning' },
    { time: '18:00', session: 'evening' },
    { time: '20:00', session: 'evening' },
  ];

  const filteredCourses = courses.filter(course => 
    selectedSession === 'all' || course.session === selectedSession
  );

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 border-blue-300 text-blue-800',
      green: 'bg-green-100 border-green-300 text-green-800',
      purple: 'bg-purple-100 border-purple-300 text-purple-800',
      orange: 'bg-orange-100 border-orange-300 text-orange-800',
      red: 'bg-red-100 border-red-300 text-red-800',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Emploi du temps</h2>
          <p className="text-slate-600">Gestion des cours jour et soir</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Nouveau cours
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un cours..."
              className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value as 'morning' | 'evening' | 'all')}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les sessions</option>
              <option value="morning">Cours du jour</option>
              <option value="evening">Cours du soir</option>
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setSelectedSession('morning')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedSession === 'morning' 
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sun className="w-4 h-4" />
              Jour
            </button>
            <button
              onClick={() => setSelectedSession('evening')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedSession === 'evening' 
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Moon className="w-4 h-4" />
              Soir
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700 min-w-[120px]">
                  Horaire
                </th>
                {days.map(day => (
                  <th key={day} className="px-6 py-4 text-left text-sm font-medium text-slate-700 min-w-[200px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {timeSlots.map((slot) => (
                <tr key={slot.time} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900 border-r border-slate-200">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {slot.time}
                      {slot.session === 'morning' ? (
                        <Sun className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <Moon className="w-4 h-4 text-indigo-500" />
                      )}
                    </div>
                  </td>
                  {days.map(day => {
                    const course = filteredCourses.find(c => c.day === day && c.time.startsWith(slot.time));
                    return (
                      <td key={`${day}-${slot.time}`} className="px-6 py-4">
                        {course ? (
                          <div className={`p-3 rounded-lg border-2 ${getColorClasses(course.color)} hover:shadow-md transition-shadow cursor-pointer`}>
                            <div className="font-medium text-sm mb-1">{course.title}</div>
                            <div className="text-xs opacity-75 mb-2">{course.code}</div>
                            <div className="flex items-center gap-2 text-xs opacity-75">
                              <User className="w-3 h-3" />
                              {course.teacher}
                            </div>
                            <div className="flex items-center gap-2 text-xs opacity-75">
                              <MapPin className="w-3 h-3" />
                              {course.room}
                            </div>
                            <div className="text-xs opacity-75 mt-1">
                              {course.students} étudiants
                            </div>
                          </div>
                        ) : (
                          <div className="h-20 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                            <Plus className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Sun className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {courses.filter(c => c.session === 'morning').length}
              </p>
              <p className="text-sm text-slate-600">Cours du jour</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Moon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {courses.filter(c => c.session === 'evening').length}
              </p>
              <p className="text-sm text-slate-600">Cours du soir</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {courses.reduce((sum, course) => sum + course.students, 0)}
              </p>
              <p className="text-sm text-slate-600">Étudiants inscrits</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {courses.length}
              </p>
              <p className="text-sm text-slate-600">Total cours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModule;