import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import TimetablePage from './pages/modules/TimetablePage';
import CoursesPage from './pages/modules/CoursesPage';
import ClassesPage from './pages/modules/ClassesPage';
import TeachersPage from './pages/modules/TeachersPage';

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes - no login required */}
          <Route path="/" element={<ClassesPage />} />
          <Route path="/gestion-salles" element={<ClassesPage />} />
          
          {/* Login route */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes - login required */}
          
          <Route
            path="/modules/timetable"
            element={
              <ProtectedRoute>
                <TimetablePage />
              </ProtectedRoute>
            }
          />
           
          <Route
            path="/modules/courses"
            element={
              <ProtectedRoute>
                <CoursesPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/modules/classrooms"
            element={
              <ProtectedRoute>
                <ClassesPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/modules/teachers"
            element={
              <ProtectedRoute>
                <TeachersPage />
              </ProtectedRoute>
            }
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;