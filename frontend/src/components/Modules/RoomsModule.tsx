import React, { useState } from 'react';
import { 
  Building, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Monitor, 
  Thermometer,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const RoomsModule: React.FC = () => {
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const rooms = [
    {
      id: 1,
      name: 'Salle A101',
      code: 'A101',
      type: 'classroom',
      capacity: 40,
      building: 'Bâtiment A',
      floor: 1,
      status: 'available',
      hasProjector: true,
      hasAc: true,
      hasComputers: false,
      currentReservation: null,
      nextReservation: '14:00 - Cours de Mathématiques',
      equipment: ['Tableau blanc', 'Projecteur', 'Climatisation']
    },
    {
      id: 2,
      name: 'Laboratoire Info A',
      code: 'LABA',
      type: 'lab',
      capacity: 30,
      building: 'Bâtiment A',
      floor: 2,
      status: 'occupied',
      hasProjector: true,
      hasAc: true,
      hasComputers: true,
      currentReservation: 'Programmation Web - Dr. Mballa',
      nextReservation: '16:00 - Base de données',
      equipment: ['30 PC', 'Projecteur', 'Climatisation', 'Tableau interactif']
    },
    {
      id: 3,
      name: 'Amphithéâtre',
      code: 'AMPHI',
      type: 'amphitheater',
      capacity: 150,
      building: 'Bâtiment B',
      floor: 1,
      status: 'available',
      hasProjector: true,
      hasAc: true,
      hasComputers: false,
      currentReservation: null,
      nextReservation: '18:00 - Conférence',
      equipment: ['Sono', 'Projecteur', 'Climatisation', 'Micro']
    },
    {
      id: 4,
      name: 'Salle B201',
      code: 'B201',
      type: 'classroom',
      capacity: 35,
      building: 'Bâtiment B',
      floor: 2,
      status: 'maintenance',
      hasProjector: false,
      hasAc: true,
      hasComputers: false,
      currentReservation: null,
      nextReservation: 'Maintenance - Réparation projecteur',
      equipment: ['Tableau blanc', 'Climatisation']
    },
    {
      id: 5,
      name: 'Atelier Maintenance',
      code: 'ATEL',
      type: 'workshop',
      capacity: 20,
      building: 'Bâtiment C',
      floor: 1,
      status: 'available',
      hasProjector: false,
      hasAc: false,
      hasComputers: false,
      currentReservation: null,
      nextReservation: '20:00 - Travaux pratiques',
      equipment: ['Outils', 'Établis', 'Matériel sécurité']
    }
  ];

  const filteredRooms = rooms.filter(room => {
    return (selectedFloor === 'all' || room.floor.toString() === selectedFloor) &&
           (selectedType === 'all' || room.type === selectedType);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-300';
      case 'occupied': return 'bg-red-100 text-red-800 border-red-300';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'occupied': return <Users className="w-4 h-4" />;
      case 'maintenance': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'classroom': return 'Salle de classe';
      case 'lab': return 'Laboratoire';
      case 'amphitheater': return 'Amphithéâtre';
      case 'workshop': return 'Atelier';
      default: return 'Autre';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion des salles</h2>
          <p className="text-slate-600">Réservations et maintenance des espaces</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Nouvelle salle
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une salle..."
              className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les étages</option>
              <option value="1">1er étage</option>
              <option value="2">2ème étage</option>
              <option value="3">3ème étage</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="classroom">Salle de classe</option>
              <option value="lab">Laboratoire</option>
              <option value="amphitheater">Amphithéâtre</option>
              <option value="workshop">Atelier</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{rooms.length}</p>
              <p className="text-sm text-slate-600">Total salles</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {rooms.filter(r => r.status === 'available').length}
              </p>
              <p className="text-sm text-slate-600">Disponibles</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {rooms.filter(r => r.status === 'occupied').length}
              </p>
              <p className="text-sm text-slate-600">Occupées</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {rooms.filter(r => r.status === 'maintenance').length}
              </p>
              <p className="text-sm text-slate-600">Maintenance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{room.name}</h3>
                <p className="text-sm text-slate-600">{room.code}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(room.status)} flex items-center gap-1`}>
                {getStatusIcon(room.status)}
                {room.status === 'available' ? 'Disponible' : 
                 room.status === 'occupied' ? 'Occupée' : 'Maintenance'}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4" />
                {room.building} • Étage {room.floor}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="w-4 h-4" />
                {room.capacity} places • {getTypeLabel(room.type)}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {room.hasProjector && (
                <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  <Monitor className="w-3 h-3" />
                  Projecteur
                </div>
              )}
              {room.hasAc && (
                <div className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  <Thermometer className="w-3 h-3" />
                  Climatisation
                </div>
              )}
              {room.hasComputers && (
                <div className="flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  <Monitor className="w-3 h-3" />
                  Ordinateurs
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="text-sm text-slate-600 mb-2">
                {room.currentReservation ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>En cours: {room.currentReservation}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Libre maintenant</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Prochaine: {room.nextReservation}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Réserver
              </button>
              <button className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Détails
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsModule;