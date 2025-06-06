// src/pages/track-delivery/Index.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import axios from '@/lib/axios';
import styles from './Index.module.css';

const TrackDelivery = () => {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Faça login novamente.');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`/api/deliveries/${id}`, config);
        setDelivery(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Entrega não encontrada.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <DashboardLayout><p>Carregando...</p></DashboardLayout>;
  if (error) return <DashboardLayout><p>{error}</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Rastrear Entrega #{id}</h1>
        {delivery && <p>{delivery.customer} - {delivery.address} - {delivery.status}</p>}
      </div>
    </DashboardLayout>
  );
};

export default TrackDelivery;