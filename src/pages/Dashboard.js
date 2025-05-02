import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUser, getOrders, createOrder, getDrivers } from "../api/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [newOrder, setNewOrder] = useState({ customer: "", total: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser();
        setUser(userData);

        const ordersData = await getOrders();
        setOrders(ordersData);

        const driversData = await getDrivers();
        setDrivers(driversData);

        setLoading(false);
      } catch (error) {
        setError("Erro ao carregar dados: " + error.message);
        navigate("/");
      }
    };
    fetchData();
  }, [navigate]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await createOrder(newOrder);
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
      setNewOrder({ customer: "", total: "" });
    } catch (error) {
      setError("Erro ao criar pedido: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho com Navegação */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">NaHora Delivery</h1>
          <nav className="space-x-6">
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/orders" className="hover:underline">Pedidos</Link>
            <Link to="/profile" className="hover:underline">Perfil</Link>
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto p-6">
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Dashboard - {user?.role || "Usuário"}</h2>
          <p className="text-lg">Bem-vindo, {user?.email || "Usuário"}!</p>
          <p className="text-gray-600">Você está logado como: {user?.role || "Desconhecido"}</p>
        </div>

        {/* Prévia de Pedidos Recentes */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pedidos Recentes</h2>
          <div className="space-y-4">
            {orders.slice(0, 2).map((order) => (
              <div key={order._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                <div>
                  <p className="font-semibold">Pedido #{order._id}</p>
                  <p className="text-gray-600">Cliente: {order.customer}</p>
                  <p className="text-gray-600">Total: R$ {order.total.toFixed(2)}</p>
                  <p className={`text-sm ${order.status === "Pendente" ? "text-red-600" : "text-green-600"}`}>
                    Status: {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/orders")}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Ver Todos os Pedidos
          </button>
        </div>

        {/* Formulário para Criar Novo Pedido */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Criar Novo Pedido</h2>
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div>
              <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
                Cliente
              </label>
              <input
                id="customer"
                type="text"
                value={newOrder.customer}
                onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nome do cliente"
                required
              />
            </div>
            <div>
              <label htmlFor="total" className="block text-sm font-medium text-gray-700">
                Total
              </label>
              <input
                id="total"
                type="number"
                step="0.01"
                value={newOrder.total}
                onChange={(e) => setNewOrder({ ...newOrder, total: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="R$ 0,00"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Criar Pedido
            </button>
          </form>
        </div>

        {/* Entregadores Disponíveis */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Entregadores Disponíveis</h2>
          <div className="space-y-4">
            {drivers.map((driver) => (
              <div key={driver._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                <div>
                  <p className="font-semibold">{driver.name}</p>
                  <p className={`text-sm ${driver.status === "Disponível" ? "text-green-600" : "text-red-600"}`}>
                    Status: {driver.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
        >
          Sair
        </button>
      </main>
    </div>
  );
};

export default Dashboard;