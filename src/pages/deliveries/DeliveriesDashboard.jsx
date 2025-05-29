import React, { useState, useEffect } from "react";
import { PackageSearch, Truck, Clock, Wallet, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DeliveryStatusCard } from "@/components/dashboard/DeliveryStatusCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const DeliveriesDashboard = () => {
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [stats, setStats] = useState({
    deliveriesToday: 0,
    activeDeliveries: 0,
    averageTime: "0 min",
    dailyEarnings: "R$ 0,00",
    driversOnline: 0,
    acceptanceTime: "0 min",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // Fetch active deliveries
        const deliveriesResponse = await fetch("https://api.example.com/api/deliveries?status=pending,accepted,picked", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!deliveriesResponse.ok) {
          throw new Error("Erro ao buscar entregas ativas");
        }

        const deliveriesData = await deliveriesResponse.json();
        setActiveDeliveries(deliveriesData);

        // Fetch dashboard stats
        const statsResponse = await fetch("https://api.example.com/api/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!statsResponse.ok) {
          throw new Error("Erro ao buscar estatísticas do dashboard");
        }

        const statsData = await statsResponse.json();
        setStats({
          deliveriesToday: statsData.deliveriesToday || 0,
          activeDeliveries: statsData.activeDeliveries || 0,
          averageTime: statsData.averageTime || "28 min",
          dailyEarnings: `R$ ${statsData.revenueToday || "0.00"}`,
          driversOnline: statsData.driversOnline || 0,
          acceptanceTime: statsData.acceptanceTime || "0 min",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de controle de entregas.
          </p>
        </div>
        <Button className="bg-javai-purple hover:bg-javai-purple-dark" onClick={() => window.location.href = "/new-delivery"}>
          Nova Entrega
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Entregas Hoje"
          value={stats.deliveriesToday.toString()}
          icon={PackageSearch}
          description="2 entregas a mais que ontem"
        />
        <StatCard
          title="Entregas em Andamento"
          value={stats.activeDeliveries.toString()}
          icon={Truck}
          description="3 pendentes, 2 em rota"
        />
        <StatCard
          title="Tempo Médio"
          value={stats.averageTime}
          icon={Clock}
          description="Média das últimas 24h"
        />
        <StatCard
          title="Faturamento do Dia"
          value={stats.dailyEarnings}
          icon={Wallet}
          description={`${stats.deliveriesToday} entregas realizadas`}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance de Entregas</CardTitle>
            <CardDescription>Total de entregas dos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              <Activity className="h-16 w-16 text-javai-purple opacity-30" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
            <CardDescription>Motoboys disponíveis próximos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Motoboys Online</span>
                <span className="font-bold text-green-600">{stats.driversOnline}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tempo de Aceite</span>
                <span className="font-bold">{stats.acceptanceTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Operacional
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Entregas Ativas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {activeDeliveries.map((delivery) => (
            <DeliveryStatusCard key={delivery._id} {...delivery} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeliveriesDashboard;