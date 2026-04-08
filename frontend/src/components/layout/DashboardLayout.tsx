import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { modules } from '../../data/modules';
import * as Icons from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

// Helper function to dynamically get icon components
const getIcon = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent ? <IconComponent size={20} /> : <Icons.FileBox size={20} />;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-primary-800 text-white transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } fixed h-full z-10`}
      >
        <div className="flex items-center justify-between p-4 border-b border-primary-700">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-white"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
              </svg>
              <span className="font-bold">ENSET - LESIX</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className={`rounded p-1 hover:bg-primary-700 ${sidebarCollapsed ? 'mx-auto' : ''}`}
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="mt-4 px-2">
          <div className={`mt-4 ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
            {modules.map((module) => (
              <Link
                key={module.id}
                to={module.path}
                className={`flex items-center ${
                  sidebarCollapsed ? 'justify-center' : 'space-x-3'
                } px-4 py-3 rounded-lg mb-1 ${
                  location.pathname === module.path
                    ? 'bg-primary-700 text-white'
                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                } transition-colors`}
              >
                {getIcon(module.icon)}
                {!sidebarCollapsed && <span>{module.name}</span>}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-primary-700 p-4">
          <div className={`flex ${sidebarCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-primary-300">
                  {user?.role === 'admin' ? 'Administrateur' : user?.role === 'teacher' ? 'Enseignant' : 'Étudiant'}
                </span>
              </div>
            )}
            <button
              onClick={() => logout()}
              className="p-2 rounded-full hover:bg-primary-700 text-primary-200 hover:text-white transition-colors"
              title="Déconnexion"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;