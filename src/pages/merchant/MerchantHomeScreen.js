// src/pages/merchant/MerchantHomeScreen.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Package, Clock } from "lucide-react";
import api from "../../api/services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";

function MerchantHomeScreen() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ active: 0, completed: 0, pending: 0 });
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/deliveries");
      const deliveries = response.data;
      const active = deliveries.filter((d) => ["pending", "accepted", "picked"].includes(d.status)).length;
      const completed = deliveries.filter((d) => d.status === "delivered").length;
      const pending = deliveries.filter((d) => d.status === "pending").length;
      setStats({ active, completed, pending });
    } catch (err) {
      setError("Erro ao carregar estatísticas: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 pt-16 pb-16" style={{ backgroundColor: "hsl(222.2 84% 4.9%)" }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Painel do Comerciante</h1>
          <p className="text-muted-foreground">Visão geral das suas entregas e ações rápidas.</p>
        </div>

        {error && <div className="mb-4 p-4 bg-destructive text-white rounded-md">{error}</div>}

        {/* Resumo de Estatísticas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <div className="p-4 bg-card rounded-md shadow-md border border-input flex items-center space-x-4">
            <Truck className="h-8 w-8 text-nahora-orange" />
            <div>
              <p className="text-lg font-semibold text-foreground">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Entregas Ativas</p>
            </div>
          </div>
          <div className="p-4 bg-card rounded-md shadow-md border border-input flex items-center space-x-4">
            <Package className="h-8 w-8 text-nahora-orange" />
            <div>
              <p className="text-lg font-semibold text-foreground">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Entregas Concluídas</p>
            </div>
          </div>
          <div className="p-4 bg-card rounded-md shadow-md border border-input flex items-center space-x-4">
            <Clock className="h-8 w-8 text-nahora-orange" />
            <div>
              <p className="text-lg font-semibold text-foreground">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Entregas Pendentes</p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-4">
          <button
            className="px-4 py-2 bg-nahora-orange text-white rounded-md hover:bg-nahora-orange-dark transition-colors"
            onClick={() => navigate("/new-delivery")}
          >
            Nova Entrega
          </button>
          <button
            className="px-4 py-2 bg-nahora-purple text-white rounded-md hover:bg-nahora-purple-dark transition-colors"
            onClick={() => navigate("/merchant/deliveries")}
          >
            Gerenciar Entregas
          </button>
          <button
            className="px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-muted transition-colors"
            onClick={() => navigate("/history")}
          >
            Ver Histórico
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MerchantHomeScreen;