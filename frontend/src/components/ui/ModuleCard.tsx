import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Module } from '../../types';

interface ModuleCardProps {
  module: Module;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const navigate = useNavigate();
  
  // Dynamically get the icon component
  const IconComponent = (Icons as any)[module.icon];
  
  const handleClick = () => {
    navigate(`/login?redirectTo=${module.path}`);
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
      onClick={handleClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mx-auto mb-4">
          {IconComponent && <IconComponent size={32} />}
        </div>
        <h3 className="text-xl font-semibold text-center mb-2">{module.name}</h3>
        <p className="text-gray-600 text-center">{module.description}</p>
      </div>
      <div className="bg-primary-50 px-6 py-3 text-center">
        <span className="text-primary-700 font-medium">Accéder au module</span>
      </div>
    </div>
  );
};

export default ModuleCard;