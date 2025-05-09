// src/pages/deliveries/DeliveriesPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, User } from "lucide-react";
import api from "../../api/services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";

function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/deliveries", { params: { status: "pending,accepted,picked" } });
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

  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.packageDetails.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 pt-16 pb-16" style={{ backgroundColor: "hsl(222.2 84% 4.9%)" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Entregas Ativas</h1>
            <p className="text-muted-foreground">Acompanhe e gerencie suas entregas em andamento.</p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-nahora-orange text-white rounded-md hover:bg-nahora-orange-dark transition-colors"
              onClick={() => navigate("/new-delivery")}
            >
              Nova Entrega
            </button>
            <button
              className="px-4 py-2 bg-nahora-purple text-white rounded-md hover:bg-nahora-purple-dark transition-colors"
              onClick={() => navigate("/history")}
            >
              Ver Histórico
            </button>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar entregas por cliente, endereço ou detalhes..."
            className="w-full pl-10 pr-4 py-2 bg-secondary text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-nahora-orange border border-input sm:w-[400px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Carregando entregas...</p>
          </div>
        ) : error ? (
          <div className="mb-4 p-4 bg-destructive text-white rounded-md">{error}</div>
        ) : filteredDeliveries.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDeliveries.map((delivery) => (
              <div
                key={delivery._id}
                className="p-4 bg-card rounded-md shadow-md border border-input hover:shadow-lg transition-shadow"
              >
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
                <button
                  className="mt-3 inline-block text-nahora-orange hover:underline font-medium"
                  onClick={() => navigate(`/deliveries#${delivery._id}`)}
                >
                  Rastrear Entrega
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Nenhuma entrega ativa no momento.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DeliveriesPage;