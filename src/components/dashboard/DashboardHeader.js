import React from "react";

const DashboardHeader = ({ user }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">
        Bem-vindo, {user?.name || "Usuário"}!
      </h1>
      <p className="text-gray-600">Gerencie seus pedidos e motoristas.</p>
    </div>
  );
};

export default DashboardHeader;