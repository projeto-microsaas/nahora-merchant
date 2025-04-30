import React from "react";

const DashboardStats = ({ user, orders }) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.status === "pending").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">Total de Pedidos</h2>
        <p className="text-2xl">{totalOrders}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">Pedidos Pendentes</h2>
        <p className="text-2xl">{pendingOrders}</p>
      </div>
    </div>
  );
};

export default DashboardStats;