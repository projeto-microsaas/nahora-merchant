import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DeliveryHistoryTable from "@/components/dashboard/DeliveryHistoryTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/index.jsx";
import { Search } from "lucide-react";

const History = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/api/deliveries", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar histórico de entregas");
        }

        const data = await response.json();
        setDeliveries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
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
          <h1 className="text-2xl font-bold tracking-tight">Histórico de Entregas</h1>
          <p className="text-muted-foreground">
            Visualize o histórico completo das suas entregas.
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
          placeholder="Buscar no histórico por cliente, endereço ou ID..."
          className="pl-8 w-full md:w-[300px] lg:w-[400px]"
        />
      </div>
      
      <DeliveryHistoryTable deliveries={deliveries} />
    </DashboardLayout>
  );
};

export default History;