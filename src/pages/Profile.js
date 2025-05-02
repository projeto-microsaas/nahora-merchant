import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUser, updateUser, getOrders } from "../api/api";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
        setName(userData.name || userData.email.split("@")[0]);

        const ordersData = await getOrders();
        setOrders(ordersData);

        setLoading(false);
      } catch (error) {
        setError("Erro ao carregar dados: " + error.message);
        navigate("/");
      }
    };
    fetchData();
  }, [navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {};
      if (name) updatedData.name = name;
      if (password) updatedData.password = password;
      await updateUser(updatedData);
      const updatedUser = await getUser();
      setUser(updatedUser);
      setPassword("");
    } catch (error) {
      setError("Erro ao atualizar perfil: " + error.message);
    }
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Perfil</h2>
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Informações do Usuário</h3>
            <p className="text-gray-600">Email: {user?.email}</p>
            <p className="text-gray-600">Função: {user?.role}</p>
            <p className="text-gray-600">Nome: {user?.name || user.email.split("@")[0]}</p>
          </div>

          <h3 className="text-lg font-semibold mb-4">Editar Perfil</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nova Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nova senha (opcional)"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Salvar Alterações
            </button>
          </form>

          <h3 className="text-lg font-semibold mb-4">Histórico de Pedidos</h3>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="font-semibold">Pedido #{order._id}</p>
                <p className="text-gray-600">Cliente: {order.customer}</p>
                <p className="text-gray-600">Total: R$ {order.total.toFixed(2)}</p>
                <p className="text-gray-600">Data: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;