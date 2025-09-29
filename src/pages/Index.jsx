// nahora-merchant/src/pages/Index.jsx (ou onde você colocou o arquivo)
import React, { useState, useEffect } from 'react';
import axios from '../lib/axios';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Index = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      console.log('Token encontrado:', token ? 'Sim' : 'Não');
      console.log('Fazendo requisição para: /api/deliveries/active-deliveries');
      
      const response = await fetch('/api/deliveries/active-deliveries', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos:', data);
      console.log('Número de entregas:', data.length);
      setDeliveries(data);
    } catch (err) {
      console.error('Erro completo:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <DashboardLayout>
      <h1>Entregas Ativas</h1>
      {deliveries.length === 0 ? (
        <p>Nenhuma entrega ativa encontrada.</p>
      ) : (
        <div>
          <p>Total de entregas ativas: {deliveries.length}</p>
          <ul>
            {deliveries.map((delivery) => (
              <li key={delivery._id}>
                <strong>{delivery.customer}</strong> - {delivery.status}
                <br />
                Endereço: {delivery.address}
                <br />
                Total: R$ {delivery.totalPrice}
                <br />
                Criado em: {new Date(delivery.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Index;