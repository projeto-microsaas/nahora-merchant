import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Componente de Login
const Login = ({ setToken, setIsValidToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      setIsValidToken(true);
      setSuccess('Login bem-sucedido! Redirecionando...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Merchant Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

// Componente de Dashboard
const Dashboard = ({ token, setToken, setIsValidToken }) => {
  const [orders, setOrders] = useState([]);
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setToken('');
          setIsValidToken(false);
          navigate('/login', { replace: true });
        }
      }
    };
    fetchOrders();
  }, [token, navigate, setToken, setIsValidToken]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/orders',
        { client, description, value: parseFloat(value) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders([...orders, response.data]);
      setClient('');
      setDescription('');
      setValue('');
    } catch (err) {
      console.error('Error creating order:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setToken('');
        setIsValidToken(false);
        navigate('/login', { replace: true });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setIsValidToken(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Merchant Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <div className="dashboard-content">
        <div className="create-order-section">
          <h2>Create Order</h2>
          <form onSubmit={handleCreateOrder} className="create-order-form">
            <div className="input-group">
              <label>Client:</label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                required
                placeholder="Enter client name"
              />
            </div>
            <div className="input-group">
              <label>Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Enter order description"
              />
            </div>
            <div className="input-group">
              <label>Value:</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                placeholder="Enter order value"
              />
            </div>
            <button type="submit" className="create-order-button">Create Order</button>
          </form>
        </div>
        <div className="orders-list-section">
          <h2>Orders List</h2>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Description</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.client}</td>
                  <td>{order.description}</td>
                  <td>${order.value}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsValidToken(true);
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
        setToken('');
        setIsValidToken(false);
      }
      setLoading(false);
    };
    validateToken();
  }, [token]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const router = createBrowserRouter(
    [
      {
        path: "/login",
        element: <Login setToken={setToken} setIsValidToken={setIsValidToken} />,
      },
      {
        path: "/dashboard",
        element: isValidToken ? <Dashboard token={token} setToken={setToken} setIsValidToken={setIsValidToken} /> : <Navigate to="/login" replace />,
      },
      {
        path: "/",
        element: <Navigate to="/login" replace />,
      },
    ],
    {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      },
    }
  );

  return <RouterProvider router={router} />;
};

export default App;