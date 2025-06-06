// src/pages/NotFound.jsx
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const NotFound = () => {
  return (
    <DashboardLayout>
      <div>
        <h1>404 - Página Não Encontrada</h1>
        <p>Desculpe, a página que você está procurando não existe.</p>
      </div>
    </DashboardLayout>
  );
};

export default NotFound;