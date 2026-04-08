import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="28" 
              height="28" 
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
            <span className="text-xl font-bold">LESIX</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-4">
              <Link to="/" className="hover:text-primary-100 transition-colors">
                Accueil
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="hover:text-primary-100 transition-colors">
                  Tableau de bor
                </Link>
              )}
            </nav>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User size={20} />
                    <span className="font-medium">{user?.name}</span>
                    <span className="bg-primary-500 text-xs px-2 py-1 rounded-full">
                      {user?.role === 'admin' ? 'Admin' : user?.role === 'teacher' ? 'Enseignant' : 'Étudiant'}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-primary-800 hover:bg-primary-900 px-3 py-1.5 rounded-md transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1 bg-secondary-500 hover:bg-secondary-600 px-4 py-2 rounded-md transition-colors"
                >
                  <User size={16} />
                  <span>Connexion</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 py-3 border-t border-primary-600 animate-fade-in">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="hover:bg-primary-600 px-3 py-2 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/dashboard" 
                  className="hover:bg-primary-600 px-3 py-2 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tableau de bord
                </Link>
              )}
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-primary-600">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <User size={20} />
                    <span>{user?.name}</span>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 bg-primary-800 hover:bg-primary-900 px-3 py-2 rounded-md text-left"
                  >
                    <LogOut size={16} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center space-x-2 bg-secondary-500 hover:bg-secondary-600 px-3 py-2 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={16} />
                  <span>Connexion</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;