// src/pages/new-delivery/Index.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout'; // Corrigido
import axios from '@/lib/axios';
import styles from './Index.module.css';

const NewDelivery = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ customer: '', address: '', status: 'pending' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('/api/deliveries', form, { headers: { Authorization: `Bearer ${token}` } });
      navigate('/deliveries');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar entrega.');
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Nova Entrega</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input placeholder="Cliente" value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} />
          <input placeholder="Endereço" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          <Button type="submit" style={{ backgroundColor: '#FF7300', color: 'white' }}>Criar</Button>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>
      </div>
    </DashboardLayout>
  );
};

export default NewDelivery;