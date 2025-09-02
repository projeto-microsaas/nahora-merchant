import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import styles from './DeliveryStatusPage.module.css';

const DeliveryStatusPage = () => {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDelivery = async () => {
      setLoading(true);
      setError(null);
      console.log('Iniciando fetch para ID:', id);
      try {
        const token = localStorage.getItem('authToken');
        console.log('Token usado:', token);
        if (!token) {
          throw new Error('Token de autenticação não encontrado. Faça login novamente.');
        }
        const response = await fetch(`http://localhost:5000/api/deliveries/${id}`, { // URL absoluta
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('Resposta recebida, status:', response.status);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Resposta inválida do servidor' }));
          console.log('Erro do servidor:', errorData);
          throw new Error(`${errorData.message} (Status: ${response.status})`);
        }
        const data = await response.json();
        console.log('Dados recebidos:', data);
        setDelivery(data);
        setDriver({
          name: 'João Silva',
          eta: '15 minutos',
        });
      } catch (error) {
        console.error('Erro ao buscar entrega:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDelivery();
  }, [id]);

  if (loading) return <div>Carregando status da entrega...</div>;
  if (error) return <div className={styles.error}>Erro: {error}</div>;
  if (!delivery) return <div>Entrega não encontrada.</div>;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Status da Entrega</h1>
      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>Informações do Motorista</CardTitle>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <p><strong>Motorista:</strong> {driver.name}</p>
          <p><strong>Tempo Estimado de Chegada:</strong> {driver.eta}</p>
          <p><strong>Status da Entrega:</strong> {delivery.status}</p>
          <p><strong>Destinatário:</strong> {delivery.customer}</p>
          <p><strong>Endereço de Entrega:</strong> {delivery.address}</p>
          <div className={styles.productsSection}>
            <h3 className={styles.productsTitle}>Produtos da Entrega</h3>
            {delivery.order && delivery.order.products && delivery.order.products.length > 0 ? (
              <ul className={styles.productsList}>
                {delivery.order.products.map((product, index) => (
                  <li key={index} className={styles.productItem}>
                    {product.name || `Produto ${index + 1}`} - R${product.price || '0.00'}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum produto encontrado nesta entrega.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryStatusPage;