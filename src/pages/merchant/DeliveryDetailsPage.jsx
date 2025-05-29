import React from 'react';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Clock, User, MapPin, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { formatPrice } from "@/lib/utils";

const DeliveryDetailsPage = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDelivery = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token de autenticação não encontrado");

        const response = await axios.get(`http://localhost:5000/api/deliveries/${deliveryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDelivery(response.data);
      } catch (error) {
        console.error("Error loading delivery:", error);
        toast({
          title: "Erro ao carregar detalhes da entrega",
          description: "Entrega não encontrada ou erro de conexão",
          variant: "destructive",
        });
        navigate("/merchant");
      } finally {
        setIsLoading(false);
      }
    };

    if (deliveryId) loadDelivery();
  }, [deliveryId, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen p-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Carregando detalhes...</h1>
        </div>
        <div className="flex justify-center items-center flex-1">
          <div className="animate-pulse flex flex-col w-full max-w-md space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-5 w-5 mr-2" /> Voltar
        </Button>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-semibold">Entrega não encontrada</h3>
          <p className="text-muted-foreground mt-2">Os detalhes desta entrega não estão disponíveis</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500 bg-yellow-500/10";
      case "accepted":
        return "text-blue-500 bg-blue-500/10";
      case "delivered":
        return "text-green-500 bg-green-500/10";
      case "canceled":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="p-4 pb-16">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Detalhes da Entrega</h1>
          <p className="text-muted-foreground">Pedido #{delivery._id}</p>
        </div>
      </div>

      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-javai-orange" />
            <span className="font-medium">Status:</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
            {delivery.status}
          </span>
        </div>
      </Card>

      <Card className="p-4 mb-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <User className="h-5 w-5 mr-2 text-javai-orange" />
          Informações do Cliente
        </h3>
        <div className="space-y-2">
          <div className="flex items-start">
            <span className="font-medium min-w-32">Nome:</span>
            <span>{delivery.customer}</span>
          </div>
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">{delivery.address}</span>
          </div>
        </div>
      </Card>

      <Card className="p-4 mb-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-javai-orange" />
          Itens do Pedido
        </h3>
        <div className="space-y-3">
          {delivery.items?.split(";").map((item, index) => (
            <div key={index} className="flex justify-between">
              <div className="flex-1">
                <p className="font-medium">{item.split(":")[0]}</p>
                <p className="text-sm text-muted-foreground">Qtd: {item.split(":")[1]}</p>
              </div>
            </div>
          ))}
          <Separator className="my-2" />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-javai-orange" />
          Informações da Entrega
        </h3>
        <div className="space-y-2">
          <div className="flex items-start">
            <span className="font-medium min-w-32">Pedido criado:</span>
            <span>{new Date(delivery.createdAt).toLocaleString("pt-BR")}</span>
          </div>

          {delivery.driver && (
            <>
              <div className="flex items-start">
                <span className="font-medium min-w-32">Entregador:</span>
                <span>{delivery.driver.name}</span>
              </div>
            </>
          )}
        </div>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => window.location.href = `/merchant/track/${delivery._id}`}>
          Rastrear
        </Button>
        <Button
          variant={delivery.status === "delivered" || delivery.status === "canceled" ? "outline" : "default"}
          className="flex-1 bg-javai-orange hover:bg-javai-orange/90"
          disabled={delivery.status === "delivered" || delivery.status === "canceled"}
        >
          {delivery.status === "pending" ? "Confirmar" : delivery.status === "accepted" ? "Notificar Cliente" : "Concluído"}
        </Button>
      </div>
    </div>
  );
};

export default DeliveryDetailsPage;