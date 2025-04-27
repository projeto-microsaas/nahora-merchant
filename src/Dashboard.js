import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

const Dashboard = () => {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState('');
  const [driverId, setDriverId] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get(`${API_BASE_URL}/api/auth/drivers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDrivers(response.data);
      } catch (err) {
        setError('Erro ao buscar motoristas. Tente novamente.');
        console.error('Erro ao buscar motoristas:', err);
      }
    };

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get(`${API_BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        setError('Erro ao buscar pedidos. Tente novamente.');
        console.error('Erro ao buscar pedidos:', err);
      }
    };

    fetchDrivers();
    fetchOrders();
  }, []);

  const handleCreateOrder = async () => {
    const trimmedCustomerName = customerName.trim();
    const trimmedItems = items.trim();
    if (!trimmedCustomerName || !trimmedItems) {
      setError('Nome do cliente e itens são obrigatórios');
      setSuccess('');
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Faça login para continuar');
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}/api/orders`,
        { customerName: trimmedCustomerName, items: trimmedItems, driverId: driverId || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Pedido criado com sucesso!');
      setError('');
      setCustomerName('');
      setItems('');
      setDriverId('');
      setOrders([...orders, response.data.order]);
    } catch (err) {
      setError('Erro ao criar pedido: ' + (err.response?.data?.message || 'Tente novamente.'));
      setSuccess('');
      console.error('Erro ao criar pedido:', err);
    }
  };

  const isFormValid = customerName.trim() && items.trim();

  return (
    <div>
      <h2>Dashboard do Comerciante</h2>
      <div>
        <h3>Criar Novo Pedido</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <div>
          <label>Nome do Cliente:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Digite o nome do cliente"
          />
        </div>
        <div>
          <label>Itens:</label>
          <input
            type="text"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            placeholder="Digite os itens (ex.: Produto A, Produto B)"
          />
        </div>
        <div>
          <label>Atribuir Motorista (opcional):</label>
          <select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            <option value="">Nenhum</option>
            {drivers.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleCreateOrder} disabled={!isFormValid}>
          Criar Pedido
        </button>
      </div>
      <div>
        <h3>Pedidos</h3>
        {orders.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order._id}>
                {order.customerName} - {order.items} - Status: {order.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;