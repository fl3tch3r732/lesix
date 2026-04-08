import React from 'react';
import { Construction, Clock, CheckCircle } from 'lucide-react';

interface ComingSoonModuleProps {
  title: string;
  description: string;
  features: string[];
  estimatedDate?: string;
}

const ComingSoonModule: React.FC<ComingSoonModuleProps> = ({ 
  title, 
  description, 
  features, 
  estimatedDate 
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Construction className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-600 text-lg">{description}</p>
      </div>

      {/* Status Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-900">En cours de développement</h3>
            {estimatedDate && (
              <p className="text-blue-700">Date prévue: {estimatedDate}</p>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h4 className="font-semibold text-slate-900 mb-4">Fonctionnalités prévues :</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Progression du développement</h3>
          <span className="text-sm text-slate-600">35% complété</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: '35%' }}
          ></div>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          Nous travaillons activement sur ce module. Merci pour votre patience !
        </p>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Feuille de route</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-slate-900">Phase 1: Analyse et conception</p>
              <p className="text-sm text-slate-600">Terminé - Spécifications fonctionnelles définies</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-slate-900">Phase 2: Développement des fonctionnalités de base</p>
              <p className="text-sm text-slate-600">En cours - Interface utilisateur et logique métier</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 bg-slate-300 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-slate-900">Phase 3: Tests et optimisation</p>
              <p className="text-sm text-slate-600">À venir - Tests utilisateur et corrections</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 bg-slate-300 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-slate-900">Phase 4: Déploiement</p>
              <p className="text-sm text-slate-600">À venir - Mise en production et formation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModule;