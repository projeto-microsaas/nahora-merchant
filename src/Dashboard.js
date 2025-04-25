
import React, { useState, useEffect } from 'react';
import api from './api';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/api/orders');
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      }
    };
    fetchOrders();
  }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/orders', {
        client,
        description,
        value: Number(value),
      });
      setOrders([...orders, response.data]);
      setClient('');
      setDescription('');
      setValue('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    }
  };

  return (
    <div>
      <h2>Merchant Dashboard</h2>
      <h3>Create New Order</h3>
      <form onSubmit={handleCreateOrder}>
        <div>
          <label>Client:</label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Value:</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Create Order</button>
      </form>
      <h3>Orders</h3>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order._id}>
              {order.client} - {order.description} - ${order.value} - Status: {order.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
