import React from "react";

const OrderList = ({ orders, drivers }) => {
  const getDriverName = (driverId) => {
    const driver = drivers.find((d) => d.id === driverId);
    return driver ? driver.name : "Desconhecido";
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Lista de Pedidos</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">Nenhum pedido encontrado.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map((order) => (
            <li key={order.id} className="p-2 border rounded">
              <p><strong>Descrição:</strong> {order.description}</p>
              <p><strong>Motorista:</strong> {getDriverName(order.driverId)}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderList;