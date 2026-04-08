import React, { useState } from 'react';
import { GraduationCap, Users, Calendar, Building, Monitor } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    {
      icon: Calendar,
      title: 'Emploi du temps',
      description: 'Gestion complète des plannings jour/soir'
    },
    {
      icon: Users,
      title: 'Gestion des utilisateurs',
      description: 'Étudiants, enseignants et administrateurs'
    },
    {
      icon: Building,
      title: 'Salles',
      description: 'Réservations'
    },
    {
      icon: Monitor,
      title: 'Suivi en temps réel',
      description: 'Tableaux de bord et statistiques'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">ENSET Douala</h1>
                <p className="text-slate-600">LENIX</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Features */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Plateforme ERP Complète
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Gérez efficacement votre université avec notre solution intégrée, 
                  conçue spécialement pour les besoins de ENSET de Douala.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                        <p className="text-sm text-slate-600">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl text-white">
                <h3 className="text-xl font-bold mb-2">Cours du jour et du soir</h3>
                <p className="text-blue-100">
                  Notre système prend en charge les plannings flexibles avec des créneaux 
                  spécifiques pour les cours du jour (8h-17h) et du soir (18h-22h).
                </p>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {isLogin ? 'Connexion' : 'Inscription'}
                </h2>
                <p className="text-slate-600">
                  {isLogin 
                    ? 'Accédez à votre espace personnel'
                    : 'Créez votre compte pour commencer'
                  }
                </p>
              </div>

              {isLogin ? (
                <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
              ) : (
                <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-6 h-6" />
            <span className="text-lg font-semibold">ENSET - ERP LESIX</span>
          </div>
          <p className="text-slate-400">
            © 2026 ENSET Douala. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;