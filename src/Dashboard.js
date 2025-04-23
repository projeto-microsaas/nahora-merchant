import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ token, setToken }) => {
  const [orders, setOrders] = useState([]);
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
    fetchOrders();
  }, [token]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/orders',
        {
          client,
          description,
          value: parseFloat(value),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders([...orders, response.data]);
      setClient('');
      setDescription('');
      setValue('');
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <div>
      <h2>Merchant Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>Create Order</h3>
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
        <button type="submit">Create Order</button>
      </form>

      <h3>Orders List</h3>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            {order.client} - {order.description} - ${order.value} - Status: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
