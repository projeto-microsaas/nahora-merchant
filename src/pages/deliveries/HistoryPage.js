// src/pages/deliveries/HistoryPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DeliveryHistoryTable from "../../components/dashboard/DeliveryHistoryTable";

function HistoryPage() {
  const navigate = useNavigate();

  const historyDeliveries = [
    {
      id: "DEL001",
      date: "2025-05-01",
      customer: "João Silva",
      address: "Rua das Flores, 123, Centro, São Paulo - SP",
      status: "delivered",
      cost: "R$ 50,00",
      trackingLink: "#DEL001",
    },
    {
      id: "DEL002",
      date: "2025-05-03",
      customer: "Maria Oliveira",
      address: "Av. Paulista, 456, Bela Vista, São Paulo - SP",
      status: "cancelled",
      cost: "R$ 30,00",
    },
    {
      id: "DEL003",
      date: "2025-05-05",
      customer: "Pedro Souza",
      address: "Rua da Paz, 789, Jardim Europa, São Paulo - SP",
      status: "delivered",
      cost: "R$ 70,00",
      trackingLink: "#DEL003",
    },
  ];

  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredDeliveries = historyDeliveries.filter(
    (delivery) =>
      delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 pt-16 pb-16" style={{ backgroundColor: "hsl(222.2 84% 4.9%)" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Histórico de Entregas</h1>
            <p className="text-gray-300">Veja o histórico completo das suas entregas.</p>
          </div>
          <button
            className="px-4 py-2 bg-nahora-orange text-white rounded-md hover:bg-nahora-orange-dark transition-colors"
            onClick={() => navigate("/new-delivery")}
          >
            Nova Entrega
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-300" />
          <input
            type="text"
            placeholder="Buscar por cliente ou endereço..."
            className="w-full pl-10 pr-4 py-2 bg-secondary text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-nahora-orange border border-input sm:w-[400px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DeliveryHistoryTable deliveries={filteredDeliveries} />
      </div>
    </DashboardLayout>
  );
}

export default HistoryPage;