import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';

const Index = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    console.log('Iniciando fetchData');
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      console.log('Token encontrado:', token);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      console.log('Tentando conectar a:', axios.getUri({ url: '/api/deliveries/active-deliveries', ...config }));
      const response = await axios.get('/api/deliveries/active-deliveries', config);
      console.log('Resposta recebida:', response.data);
      setDeliveries(response.data);
    } catch (err) {
      console.error('Erro capturado:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log('FetchData finalizado');
    }
  };

  useEffect(() => {
    console.log('useEffect disparado');
    fetchData();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Entregas Ativas</h1>
      <ul>
        {deliveries.length === 0 ? <li>Nenhuma entrega encontrada</li> : deliveries.map((delivery) => (
          <li key={delivery._id}>{delivery.customer} - {delivery.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default Index;