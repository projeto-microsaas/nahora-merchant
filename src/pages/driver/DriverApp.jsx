import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DriverStatusBar } from "@/components/driver/DriverStatusBar";
import { DriverTabHeader } from "@/components/driver/DriverTabHeader";
import { DriverStatusSelector } from "@/components/driver/DriverStatusSelector";
import { DriverSearchBox } from "@/components/driver/DriverSearchBox";
import { DriverRecentLocations } from "@/components/driver/DriverRecentLocations";
import { DriverQuickActions } from "@/components/driver/DriverQuickActions";
import { DriverPromoBanner } from "@/components/driver/DriverPromoBanner";
import { DeliveryRequestCard } from "@/components/driver/DeliveryRequestCard";
import { ActiveDeliveryCard } from "@/components/driver/ActiveDeliveryCard";
import { DriverOrderHistory } from "@/components/driver/DriverOrderHistory";
import { DriverBottomNav } from "@/components/driver/DriverBottomNav";
import { DriverEarningsButton } from "@/components/driver/DriverEarningsButton";
import { DriverActivityScreen } from "@/components/driver/DriverActivityScreen";
import { DriverAccountScreen } from "@/components/driver/DriverAccountScreen";
import { DriverLoadingScreen } from "@/components/driver/DriverLoadingScreen";

const DriverApp = () => {
  const navigate = useNavigate();
  const [driverStatus, setDriverStatus] = useState("AVAILABLE");
  const [showDeliveryRequests, setShowDeliveryRequests] = useState(true);
  const [deliveryRequests, setDeliveryRequests] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveryRequests = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("https://api.example.com/api/deliveries", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar solicitações de entrega");
        }

        const data = await response.json();
        // Filtra entregas pendentes para o motorista
        const pendingDeliveries = data.filter((delivery) => delivery.status === "pending" && !delivery.driver);
        setDeliveryRequests(pendingDeliveries);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveryRequests();
  }, []);

  const handleBottomNavChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAcceptDelivery = async (delivery) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`https://api.example.com/api/orders/${delivery._id}/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao aceitar entrega");
      }

      const updatedDelivery = await response.json();
      setShowDeliveryRequests(false);
      setActiveDelivery({
        id: updatedDelivery._id,
        status: "accepted",
        customer: updatedDelivery.customer,
        pickupAddress: updatedDelivery.address,
        deliveryAddress: updatedDelivery.address, // Ajustar se houver campo específico
        items: updatedDelivery.items,
        timestamp: new Date().toLocaleTimeString(),
      });
      toast.success("Entrega aceita! Dirija-se ao local de coleta.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRejectDelivery = async (delivery) => {
    try {
      // No backend atual, não há endpoint específico para rejeitar. Simulamos fechando a solicitação.
      setShowDeliveryRequests(false);
      toast.info("Entrega rejeitada");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCloseDeliveryRequest = () => {
    setShowDeliveryRequests(false);
    toast.info("Solicitação de entrega fechada");
  };

  const handleUpdateDeliveryStatus = async () => {
    if (!activeDelivery) return;

    try {
      const newStatus = activeDelivery.status === "accepted" ? "picked" : "delivered";
      const token = localStorage.getItem("authToken");
      const response = await fetch(`https://api.example.com/api/deliveries/${activeDelivery.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar status da entrega");
      }

      setActiveDelivery({ ...activeDelivery, status: newStatus });
      if (newStatus === "picked") {
        toast.success("Pedido coletado! Dirija-se ao endereço de entrega.");
      } else if (newStatus === "delivered") {
        toast.success("Entrega realizada com sucesso!");
        setTimeout(() => {
          setActiveDelivery(null);
          setShowDeliveryRequests(true);
        }, 3000);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleTrackingClick = () => {
    if (activeDelivery) {
      navigate(`/track/${activeDelivery.id}`);
    }
  };

  if (isLoading) {
    return <DriverLoadingScreen message="Iniciando aplicativo de entregas" />;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <DriverStatusBar />
      
      {(activeTab === "home" || activeTab === "deliveries") && 
        <DriverTabHeader 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      }

      <div className="flex-1 overflow-auto">
        {activeTab === "home" && (
          <>
            <DriverStatusSelector 
              driverStatus={driverStatus} 
              setDriverStatus={setDriverStatus} 
            />
            <DriverSearchBox />
            <DriverEarningsButton />
            <DriverRecentLocations />
            <DriverQuickActions />
            <DriverPromoBanner />

            {driverStatus === "AVAILABLE" && showDeliveryRequests && deliveryRequests.length > 0 && (
              <DeliveryRequestCard 
                deliveryRequest={deliveryRequests[0]}
                onAccept={handleAcceptDelivery}
                onReject={handleRejectDelivery}
                onClose={handleCloseDeliveryRequest}
              />
            )}

            {activeDelivery && (
              <ActiveDeliveryCard 
                activeDelivery={activeDelivery}
                onStatusUpdate={handleUpdateDeliveryStatus}
                onTrackingClick={handleTrackingClick}
              />
            )}
          </>
        )}
        
        {activeTab === "deliveries" && <DriverOrderHistory />}
        
        {activeTab === "activity" && <DriverActivityScreen />}

        {activeTab === "account" && <DriverAccountScreen />}
      </div>

      <DriverBottomNav activeTab={activeTab} setActiveTab={handleBottomNavChange} />
    </div>
  );
};

export default DriverApp;