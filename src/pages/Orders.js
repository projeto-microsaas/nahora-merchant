import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, acceptOrder, getUser } from '../api/api.js';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser();
        console.log('Usuário logado em Orders:', userData); // Depuração
        setUser(userData);
        const ordersData = await getOrders();
        setOrders(ordersData);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        } else {
          setError('Erro ao carregar pedidos. Tente novamente.');
        }
      }
    };
    fetchData();
  }, [navigate]);

  const handleAcceptOrder = async (orderId) => {
    try {
      setError('');
      await acceptOrder(orderId);
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
    } catch (err) {
      console.error('Erro ao aceitar pedido:', err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      } else if (err.response && err.response.status === 403) {
        setError('Apenas motoristas podem aceitar pedidos.');
      } else {
        setError('Erro ao aceitar pedido. Tente novamente.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Pedidos</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div>
        {orders.map((order) => (
          <div key={order._id}>
            {order.description} - Total: {order.total !== undefined ? order.total.toFixed(2) : 'N/A'}
            {user && user.role === 'Motorista' && (
              <button
                className="btn btn-success ms-2"
                onClick={() => handleAcceptOrder(order._id)}
                disabled={order.status !== 'pending'}
              >
                Aceitar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;