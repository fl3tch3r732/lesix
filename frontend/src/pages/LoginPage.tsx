import React from 'react';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4 py-12">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default LoginPage;