import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DeliveryMap } from "@/components/delivery/DeliveryMap";
import { DeliveryStatus } from "@/components/delivery/DeliveryStatus";
import { DeliveryHeader } from "@/components/delivery/DeliveryHeader";
import { DeliveryFooter } from "@/components/delivery/DeliveryFooter";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { toast } from "sonner";

const DriverTrackDeliveryPage = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const [deliveryData, setDeliveryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`https://api.example.com/api/deliveries/${deliveryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar dados da entrega");
        }

        const data = await response.json();
        setDeliveryData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryData();
  }, [deliveryId]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleOverviewClick = () => {
    if (deliveryData) {
      toast.info(`Coleta em: ${deliveryData.address}. Tempo estimado: Não disponível`);
    }
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success("Link copiado para a área de transferência"))
      .catch(() => toast.error("Erro ao copiar link"));
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!deliveryData) {
    return <div>Entrega não encontrada</div>;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white overflow-hidden">
      <DeliveryHeader 
        courierName={deliveryData.customer || "Desconhecido"}
        onClose={handleClose}
        isDriver={true}
      />
      
      <div className="flex-1 relative">
        <DeliveryMap className="w-full h-full" />
        
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md">
          <DeliveryStatus 
            courierName={deliveryData.customer || "Desconhecido"}
            status={deliveryData.status}
            step={["pending", "accepted", "picked", "delivered"].indexOf(deliveryData.status)}
            statusText={{
              0: "Aguardando",
              1: "Aceito",
              2: "Coletado",
              3: "Entregue",
            }}
          />
        </div>
        
        <div className="absolute bottom-24 right-4">
          <ChatDialog isDriver recipientName={deliveryData.customer || "Cliente"} />
        </div>
      </div>
      
      <div className="bg-zinc-900 px-4 py-3 border-t border-zinc-800">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{deliveryData.customer || "Cliente Desconhecido"}</h3>
            <p className="text-sm text-zinc-400">{deliveryData.address}</p>
          </div>
        </div>
      </div>
      
      <DeliveryFooter 
        onOverviewClick={handleOverviewClick}
        onShareClick={handleShareClick}
      />
    </div>
  );
};

export default DriverTrackDeliveryPage;