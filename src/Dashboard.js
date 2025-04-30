import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { fetchDrivers, fetchOrders, createOrder } from './api';
import './Dashboard.css';

const Dashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    items: '',
    driverId: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Carregando Dashboard, verificando token...');
    const token = localStorage.getItem('userToken');
    console.log('Token encontrado no Dashboard:', token);
    if (!token) {
      setError('Nenhum token encontrado. Faça login novamente.');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    const loadData = async () => {
      try {
        const driversResponse = await fetchDrivers();
        setDrivers(driversResponse.data);
      } catch (err) {
        console.error('Erro ao buscar motoristas:', err);
        if (err.response?.status === 401) {
          setError('Sessão expirada. Você será redirecionado para o login.');
          localStorage.removeItem('userToken');
          setTimeout(() => navigate('/'), 2000);
          return;
        }
        setError('Erro ao carregar motoristas. Tente novamente mais tarde.');
      }

      try {
        const ordersResponse = await fetchOrders();
        setOrders(ordersResponse.data);
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        if (err.response?.status === 401) {
          setError('Sessão expirada. Você será redirecionado para o login.');
          localStorage.removeItem('userToken');
          setTimeout(() => navigate('/'), 2000);
          return;
        }
        setError('Erro ao carregar pedidos. Tente novamente mais tarde.');
      }
    };

    loadData();
  }, [navigate]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newOrder.customerName.trim() || !newOrder.items.trim()) {
      setError('Por favor, preencha o nome do cliente e os itens do pedido.');
      return;
    }

    try {
      const response = await createOrder({
        customerName: newOrder.customerName,
        items: newOrder.items,
        driverId: newOrder.driverId || null,
      });
      setSuccess('Pedido criado com sucesso!');
      setOrders((prev) => [...prev, response.data]);
      setNewOrder({ customerName: '', items: '', driverId: '' });
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      if (err.response?.status === 401) {
        setError('Sessão expirada. Você será redirecionado para o login.');
        localStorage.removeItem('userToken');
        setTimeout(() => navigate('/'), 2000);
        return;
      }
      setError('Erro ao criar pedido. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h2>Dashboard do Comerciante</h2>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <section className="create-order-section">
          <h3>Criar Novo Pedido</h3>
          <form onSubmit={handleCreateOrder}>
            <div className="form-group">
              <label>Nome do Cliente:</label>
              <input
                type="text"
                name="customerName"
                value={newOrder.customerName}
                onChange={handleInputChange}
                placeholder="Digite o nome do cliente"
                required
              />
            </div>
            <div className="form-group">
              <label>Itens do Pedido:</label>
              <input
                type="text"
                name="items"
                value={newOrder.items}
                onChange={handleInputChange}
                placeholder="Digite os itens (ex.: Produto A, Produto B)"
                required
              />
            </div>
            <div className="form-group">
              <label>Atribuir Motorista (opcional):</label>
              <select name="driverId" value={newOrder.driverId} onChange={handleInputChange}>
                <option value="">Nenhum</option>
                {drivers.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.name} ({driver.email})
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="submit-button">Criar Pedido</button>
          </form>
        </section>

        <section className="orders-section">
          <h3>Pedidos Existentes</h3>
          {orders.length === 0 ? (
            <p>Nenhum pedido encontrado.</p>
          ) : (
            <ul className="order-list">
              {orders.map((order) => (
                <li key={order._id} className="order-item">
                  Pedido #{order._id} - Cliente: {order.customerName}, Itens: {order.items}, Motorista: {order.driverId ? drivers.find(d => d._id === order.driverId)?.name || 'Atribuído' : 'Nenhum'}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="drivers-section">
          <h3>Motoristas Disponíveis</h3>
          {drivers.length === 0 ? (
            <p>Nenhum motorista encontrado.</p>
          ) : (
            <ul className="driver-list">
              {drivers.map((driver) => (
                <li key={driver._id} className="driver-item">
                  {driver.name} ({driver.email})
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
