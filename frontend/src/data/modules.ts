import { Module } from '../types';

export const modules: Module[] = [
  {
    id: 'timetable',
    name: 'Gestion des Emplois du Temps',
    icon: 'calendar',
    description: 'Planification et organisation des cours et des horaires académiques.',
    path: '/modules/timetable',
  },
  {
    id: 'courses',
    name: 'Gestion des Cours',
    icon: 'book-open',
    description: 'Création et gestion des cours et des programmes académiques.',
    path: '/modules/courses',
  },
  {
    id: 'classrooms',
    name: 'Gestion des Salles',
    icon: 'building-2',
    description: 'Allocation et suivi des salles de cours et amphithéâtres.',
    path: '/modules/classrooms',
  },
  {
    id: 'teachers',
    name: 'Gestion des Enseignants',
    icon: 'users',
    description: 'Informations et planning des enseignants et du personnel académique.',
    path: '/modules/teachers',
  },
];