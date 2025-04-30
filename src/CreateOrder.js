import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

const CreateOrder = () => {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState('');
  const [driverId, setDriverId] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Buscar motoristas disponíveis
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          setError('Faça login para continuar');
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/auth/drivers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDrivers(response.data);
      } catch (err) {
        setError('Erro ao buscar motoristas. Tente novamente.');
        console.error('Erro ao buscar motoristas:', err);
      }
    };
    fetchDrivers();
  }, []);

  const handleCreateOrder = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Faça login para continuar');
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}/api/orders`,
        { customerName, items, driverId: driverId || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Pedido criado com sucesso!');
      setError('');
      setCustomerName('');
      setItems('');
      setDriverId('');
    } catch (err) {
      setError('Erro ao criar pedido. Tente novamente.');
      setSuccess('');
      console.error('Erro ao criar pedido:', err);
    }
  };

  return (
    <div>
      <h2>Criar Pedido</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <div>
        <label>Nome do Cliente:</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>
      <div>
        <label>Itens:</label>
        <input
          type="text"
          value={items}
          onChange={(e) => setItems(e.target.value)}
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
      <button onClick={handleCreateOrder}>Criar Pedido</button>
    </div>
  );
};

export default CreateOrder;