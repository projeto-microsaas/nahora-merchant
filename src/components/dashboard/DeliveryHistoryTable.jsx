import React from "react";

const DeliveryHistoryTable = ({ deliveries = [] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Cliente</th>
            <th className="px-4 py-2">Endereço</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Data</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery._id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-4 py-2">{delivery._id}</td>
              <td className="px-4 py-2">{delivery.customer || "Sem cliente"}</td>
              <td className="px-4 py-2">{delivery.address || "Sem endereço"}</td>
              <td className="px-4 py-2">{delivery.status || "Desconhecido"}</td>
              <td className="px-4 py-2">
                {delivery.createdAt
                  ? new Date(delivery.createdAt).toLocaleString("pt-BR")
                  : "Sem data"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {deliveries.length === 0 && <p className="text-center py-4">Nenhum histórico encontrado.</p>}
    </div>
  );
};

export default DeliveryHistoryTable;