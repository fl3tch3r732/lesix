// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  department?: string;
  avatar?: string;
}

// Authentication Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: string | null;
}

// Module Types
export interface Module {
  id: string;
  name: string;
  icon: string;
  description: string;
  path: string;
}

// Timetable Types
export interface TimeSlot {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  classroom_id: number;
  teacher_id: number;
  course_id: number;
  color?: string;
  course_name?: string;
  teacher_name?: string;
  classroom_name?: string;
  teacher_confirmed?: boolean;
  confirmed_at?: string;
  created_at?: string;
}

export interface Classroom {
  id: number;
  name: string;
  capacity: number;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  department: string;
  specialization: string;
  availableDays: string[];
  user_id?: number;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  department: string;
  credits: number;
  hoursPerWeek: number;
}