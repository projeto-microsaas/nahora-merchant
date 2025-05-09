// src/components/merchant/MerchantDeliveryCard.js
import React from "react";
import { Clock, User } from "lucide-react";

function MerchantDeliveryCard({ delivery }) {
  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const diff = Math.round((now - new Date(createdAt)) / 60000);
    return `${diff} min atrás`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "accepted":
        return "bg-blue-500/20 text-blue-500";
      case "picked":
        return "bg-indigo-500/20 text-indigo-500";
      case "delivered":
        return "bg-green-500 text-white";
      default:
        return "bg-nahora-gray-dark text-foreground";
    }
  };

  return (
    <div className="p-4 bg-card rounded-md shadow-md border border-input hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-semibold text-foreground">
          Entrega #{delivery._id.slice(-5)}
        </h4>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
            delivery.status
          )}`}
        >
          {delivery.status}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground flex items-center">
          <User className="mr-2 text-nahora-orange" size={16} />
          <span className="font-medium text-foreground">Cliente:</span> {delivery.customer}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Endereço:</span> {delivery.deliveryAddress}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Detalhes:</span> {delivery.packageDetails}
        </p>
        <p className="text-sm text-muted-foreground flex items-center">
          <Clock className="mr-2" size={16} />
          <span className="font-medium text-foreground">Horário:</span> {getTimeAgo(delivery.createdAt)}
        </p>
      </div>
    </div>
  );
}

export default MerchantDeliveryCard;