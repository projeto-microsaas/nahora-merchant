import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getOrders, acceptOrder } from "../api/api";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Todos");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getOrders();
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        setError("Erro ao buscar pedidos: " + error.message);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    try {
      await acceptOrder(orderId);
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
    } catch (error) {
      setError("Erro ao aceitar pedido: " + error.message);
    }
  };

  const filteredOrders = filter === "Todos" ? orders : orders.filter((order) => order.status === filter);

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
          <h2 className="text-xl font-semibold mb-4">Pedidos</h2>
          {/* Filtro por Status */}
          <div className="mb-4 flex space-x-4">
            <button
              onClick={() => setFilter("Todos")}
              className={`${
                filter === "Todos" ? "bg-blue-600" : "bg-gray-400"
              } hover:bg-blue-700 text-white py-2 px-4 rounded-md`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter("Pendente")}
              className={`${
                filter === "Pendente" ? "bg-blue-600" : "bg-gray-400"
              } hover:bg-blue-700 text-white py-2 px-4 rounded-md`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFilter("Concluído")}
              className={`${
                filter === "Concluído" ? "bg-blue-600" : "bg-gray-400"
              } hover:bg-blue-700 text-white py-2 px-4 rounded-md`}
            >
              Concluídos
            </button>
          </div>

          {/* Lista de Pedidos */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                <div>
                  <p className="font-semibold">Pedido #{order._id}</p>
                  <p className="text-gray-600">Cliente: {order.customer}</p>
                  <p className="text-gray-600">Total: R$ {order.total.toFixed(2)}</p>
                  <p className={`text-sm ${order.status === "Pendente" ? "text-red-600" : "text-green-600"}`}>
                    Status: {order.status}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                  >
                    Ver Detalhes
                  </button>
                  <button
                    onClick={() => handleAcceptOrder(order._id)}
                    className={`${
                      order.status === "Pendente" ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                    } text-white py-2 px-4 rounded-md`}
                    disabled={order.status !== "Pendente"}
                  >
                    {order.status === "Pendente" ? "Aceitar Pedido" : "Concluído"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Detalhes do Pedido Selecionado */}
          {selectedOrder && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">Detalhes do Pedido #{selectedOrder._id}</h3>
              <p className="text-gray-600">Cliente: {selectedOrder.customer}</p>
              <p className="text-gray-600">Total: R$ {selectedOrder.total.toFixed(2)}</p>
              <p className="text-gray-600">Itens: {selectedOrder.details || "Não especificado"}</p>
              <p className={`text-sm ${selectedOrder.status === "Pendente" ? "text-red-600" : "text-green-600"}`}>
                Status: {selectedOrder.status}
              </p>
              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-2 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Orders;