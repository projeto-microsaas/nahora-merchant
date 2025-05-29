import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DeliveryStatusCard = ({ _id, customer, status, createdAt }) => {
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
      <CardHeader>
        <CardTitle>{customer}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Criado em: {new Date(createdAt).toLocaleString("pt-BR")}
        </p>
        <p className={`text-sm font-medium ${getStatusColor(status)}`}>{status}</p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => navigate(`/merchant/delivery/${_id}`)}
        >
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  );
};

export default DeliveryStatusCard;