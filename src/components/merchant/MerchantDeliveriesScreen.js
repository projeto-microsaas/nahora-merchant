// src/components/merchant/MerchantDeliveriesScreen.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package } from "lucide-react";
import api from "../../api/services/api";
import MerchantDeliveryCard from "./MerchantDeliveryCard";

function MerchantDeliveriesScreen() {
  const [deliveries, setDeliveries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/deliveries");
      setDeliveries(response.data);
    } catch (err) {
      setError("Erro ao buscar entregas: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const filteredDeliveries = deliveries
    .filter((delivery) =>
      activeTab === "active"
        ? ["pending", "accepted", "picked"].includes(delivery.status)
        : delivery.status === "delivered"
    )
    .filter(
      (delivery) =>
        delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.packageDetails.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const activeDeliveriesCount = deliveries.filter((delivery) =>
    ["pending", "accepted", "picked"].includes(delivery.status)
  ).length;

  return (
    <div className="container mx-auto p-4 pt-16 pb-16 min-h-screen" style={{ backgroundColor: "hsl(222.2 84% 4.9%)" }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Gerenciar Entregas</h1>
          <p className="text-muted-foreground">Acompanhe suas entregas ativas e concluídas.</p>
        </div>
        <button
          className="px-4 py-2 bg-nahora-orange text-white rounded-md hover:bg-nahora-orange-dark transition-colors"
          onClick={() => navigate("/new-delivery")}
        >
          Nova Entrega
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
          <button
            className={`p-2 rounded-md text-center font-medium ${
              activeTab === "active" ? "bg-nahora-orange text-white" : "bg-secondary text-muted-foreground"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Ativas ({activeDeliveriesCount})
          </button>
          <button
            className={`p-2 rounded-md text-center font-medium ${
              activeTab === "completed" ? "bg-nahora-orange text-white" : "bg-secondary text-muted-foreground"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Concluídas
          </button>
        </div>
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar entregas..."
            className="w-full pl-10 pr-4 py-2 bg-secondary text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-nahora-orange border border-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-muted-foreground">Carregando entregas...</p>
        </div>
      ) : error ? (
        <div className="mb-4 p-4 bg-destructive text-white rounded-md">{error}</div>
      ) : filteredDeliveries.length > 0 ? (
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredDeliveries.map((delivery) => (
            <MerchantDeliveryCard key={delivery._id} delivery={delivery} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <Package className="h-8 w-8 mb-2" />
          <p>
            {activeTab === "active"
              ? "Nenhuma entrega ativa no momento."
              : "Nenhuma entrega concluída no momento."}
          </p>
        </div>
      )}
    </div>
  );
}

export default MerchantDeliveriesScreen;