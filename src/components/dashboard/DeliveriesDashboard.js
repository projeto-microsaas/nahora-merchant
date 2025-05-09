import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DeliveryCard from "../../components/dashboard/DeliveryCard";
import { Activity } from "lucide-react";
import api from "../../api/services/api.js";

const DeliveriesDashboard = () => {
  const [stats, setStats] = useState({
    deliveriesToday: 0,
    activeDeliveries: 0,
    avgTime: "0 min",
    earnings: "R$ 0,00",
  });
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [error, setError] = useState("");
  const driversAvailable = 3; // Removido useState, pois não usamos setDriversAvailable

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
      setError("Erro ao buscar estatísticas. Tente novamente.");
    }
  };

  const fetchRecentDeliveries = async () => {
    try {
      const response = await api.get("/api/deliveries", {
        params: { status: "pending,accepted,picked" },
      });
      setRecentDeliveries(response.data.slice(0, 3));
    } catch (err) {
      console.error("Erro ao buscar entregas recentes:", err);
      setError("Erro ao buscar entregas recentes. Tente novamente.");
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentDeliveries();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Link to="/new-delivery">
            <button className="bg-javai-purple hover:bg-javai-purple-dark text-white font-semibold py-2 px-4 rounded">
              Nova Entrega
            </button>
          </Link>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Entregas Hoje</h2>
            <p className="text-2xl font-bold">{stats.deliveriesToday}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Entregas Ativas</h2>
            <p className="text-2xl font-bold">{stats.activeDeliveries}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Tempo Médio</h2>
            <p className="text-2xl font-bold">{stats.avgTime}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Ganhos</h2>
            <p className="text-2xl font-bold">{stats.earnings}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <Activity className="mr-2 text-javai-purple" size={20} /> Gráfico de Desempenho
          </h2>
          <p className="text-gray-500">Placeholder para gráfico de atividades (em desenvolvimento)</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Status do Sistema</h2>
          <p className="text-gray-600">Motoristas disponíveis: {driversAvailable}</p>
        </div>
        <h2 className="text-xl font-semibold mb-4">Entregas Recentes</h2>
        {recentDeliveries.length > 0 ? (
          <div className="grid gap-6">
            {recentDeliveries.map((delivery) => (
              <DeliveryCard
                key={delivery._id}
                delivery={delivery}
                onUpdate={fetchRecentDeliveries}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhuma entrega recente encontrada.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DeliveriesDashboard;