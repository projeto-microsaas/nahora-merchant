import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DeliveryStatusCard } from "@/components/dashboard/DeliveryStatusCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const DeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("https://api.example.com/api/deliveries?status=pending,accepted,picked", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar entregas ativas");
        }

        const data = await response.json();
        setDeliveries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
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
          <h1 className="text-2xl font-bold tracking-tight">Entregas Ativas</h1>
          <p className="text-muted-foreground">
            Acompanhe todas as suas entregas em andamento.
          </p>
        </div>
        <Button className="bg-javai-purple hover:bg-javai-purple-dark" onClick={() => window.location.href = "/new-delivery"}>
          Nova Entrega
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar entregas por cliente, endereço ou ID..."
          className="pl-8 w-full md:w-[300px] lg:w-[400px]"
        />
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {deliveries.map((delivery) => (
          <DeliveryStatusCard key={delivery._id} {...delivery} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DeliveriesPage;