import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../lib/axios'; // Importando o WebSocket
import styles from './DeliveryForm.module.css'; // Novo arquivo de estilos

const DeliveryForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer: '',
    phone: '',
    address: '',
    items: '', // Será convertido para array de IDs no submit
    instructions: '',
    total: '',
    estimatedArrival: 15,
    scheduledAt: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Token de autenticação não encontrado');

      const payload = {
        customer: formData.customer,
        phone: formData.phone,
        address: formData.address,
        products: formData.items.split(',').map((id) => id.trim()).filter((id) => id), // Converte string em array de IDs
        instructions: formData.instructions,
        totalPrice: parseFloat(formData.total),
        estimatedArrival: parseInt(formData.estimatedArrival),
        merchantId: JSON.parse(atob(token.split('.')[1])).id,
      };

      let endpoint = '/api/deliveries';
      if (formData.scheduledAt) {
        payload.scheduledAt = new Date(formData.scheduledAt).toISOString();
        endpoint = '/api/deliveries/schedule';
      }

      const response = await axios.post(`http://localhost:5000/api${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      socket.emit('newDeliveryScheduled'); // Notifica entregadores
      toast.success('Entrega solicitada com sucesso!');
      navigate('/deliveries');
    } catch (error) {
      toast.error(`Erro ao solicitar entrega: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Card>
        <CardContent className={styles.cardContent}>
          <div className={styles.formGroup}>
            <Label htmlFor="customer">Nome do Cliente *</Label>
            <Input
              id="customer"
              name="customer"
              placeholder="Ex: João Silva"
              value={formData.customer}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Ex: 11987654321"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="address">Endereço de Entrega *</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Ex: Rua das Flores, 123, Centro"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="items">IDs dos Produtos (separados por vírgula) *</Label>
            <Input
              id="items"
              name="items"
              placeholder="Ex: 60d5f8c8f1b3c0a4a8e9f0a5, 60d5f8c8f1b3c0a4a8e9f0a6"
              value={formData.items}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="instructions">Instruções</Label>
            <Textarea
              id="instructions"
              name="instructions"
              placeholder="Ex: Deixar na portaria"
              value={formData.instructions}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="total">Total (R$) *</Label>
            <Input
              id="total"
              name="total"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 50.00"
              value={formData.total}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="estimatedArrival">Tempo Estimado (min)</Label>
            <Input
              id="estimatedArrival"
              name="estimatedArrival"
              type="number"
              min="1"
              placeholder="Ex: 15"
              value={formData.estimatedArrival}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="scheduledAt">Agendar Para (opcional)</Label>
            <Input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Solicitando...' : 'Solicitar Entrega'}
      </Button>
    </form>
  );
};

export default DeliveryForm;