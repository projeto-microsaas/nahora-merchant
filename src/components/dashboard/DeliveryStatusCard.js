import React from "react";

  const DeliveryStatusCard = ({ id, status, customer, address }) => {
    return (
      <div className="border p-4 rounded shadow">
        <h3 className="font-bold">Entrega #{id}</h3>
        <p>Status: {status}</p>
        <p>Cliente: {customer}</p>
        <p>Endereço: {address}</p>
      </div>
    );
  };

  export default DeliveryStatusCard;