import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const HomePage: React.FC = () => {
  return (
    <Layout>
     
      {/* CTA Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Prêt à améliorer la gestion de votre université?
            </h2>
            <p className="text-gray-600 mb-8">
              Connectez-vous pour accéder à tous les modules et fonctionnalités du système.
            </p>
            <Link
              to="/login"
              className="inline-block bg-primary-600 text-white hover:bg-primary-700 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;