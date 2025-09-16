import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/layout/DashboardLayout';
import styles from './DeliveryStatusPage.module.css';

const DeliveryStatusPage = () => {
  const { id } = useParams(); // Pega o ID da rota
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDelivery = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`/api/deliveries/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDelivery(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDelivery(); // Só busca se o ID existir
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <p className={styles.loading}>Carregando...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className={styles.error}>{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.deliveryContainer}>
        <h1>Rastreamento da Entrega</h1>
        <p><strong>ID:</strong> {delivery._id}</p>
        <p><strong>Cliente:</strong> {delivery.customer}</p>
        <p><strong>Endereço:</strong> {delivery.address}</p>
        <p><strong>Status:</strong> {delivery.status}</p>

        {delivery.instructions && (
          <p><strong>Observações:</strong> {delivery.instructions}</p>
        )}

        {delivery.note && (
          <p><strong>Nota:</strong> {delivery.note}</p>
        )}

        {delivery.completedAt && (
          <p><strong>Concluída em:</strong> {new Date(delivery.completedAt).toLocaleString()}</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DeliveryStatusPage;
