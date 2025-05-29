import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MerchantDeliveryCard = ({ _id, customer, status, createdAt }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "accepted":
        return "text-blue-500";
      case "delivered":
        return "text-green-500";
      case "canceled":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{customer}</h3>
            <p className="text-sm text-muted-foreground">
              Criado em: {new Date(createdAt).toLocaleString("pt-BR")}
            </p>
            <p className={`text-sm font-medium ${getStatusColor(status)}`}>{status}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(`/merchant/delivery/${_id}`)}
          >
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MerchantDeliveryCard;