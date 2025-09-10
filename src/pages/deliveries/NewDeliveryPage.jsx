import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import AddressFields from '../../components/merchant/delivery/AddressFields';
import ResidenceTypeSelector from '../../components/merchant/delivery/ResidenceTypeSelector';
import RecipientInfo from '../../components/merchant/delivery/RecipientInfo';
import ProductList from '../../components/merchant/delivery/ProductList';
import OrderInfo from '../../components/merchant/delivery/OrderInfo';
import { toast } from 'sonner';
import axios from 'axios';
import socket from '../../lib/socket';
import styles from './NewDeliveryPage.module.css';

const NewDeliveryPage = () => {
  const methods = useForm({
    defaultValues: {
      pickupAddress: { type: '', street: '', number: '', neighborhood: '' },
      deliveryAddress: { type: '', street: '', number: '', neighborhood: '', residenceType: '', apartment: '' },
      recipient: { name: '', phone: '' },
      order: { products: [], instructions: '', total: 0 },
      scheduledAt: '',
    },
  });
  const navigate = useNavigate();
  const { handleSubmit, reset, watch, setValue } = methods;

  const selectedProducts = watch('order.products') || [];
  const total = selectedProducts.reduce((sum, product) => sum + (product.price * (product.quantity || 1)), 0);

  const onSubmit = async (data) => {
    try {
      if (!data.order.products || data.order.products.length === 0) {
        throw new Error('A entrega deve conter pelo menos um produto.');
      }
      console.log('Produtos selecionados:', data.order.products);
      if (!data.order.products.every(p => p._id && /^[0-9a-fA-F]{24}$/.test(p._id))) {
        throw new Error('Um ou mais IDs de produtos são inválidos.');
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const deliveryData = {
        customer: data.recipient.name,
        phone: data.recipient.phone,
        address: `${data.deliveryAddress.street}, ${data.deliveryAddress.number}, ${data.deliveryAddress.neighborhood}${
          data.deliveryAddress.apartment ? `, Apt ${data.deliveryAddress.apartment}` : ''
        }`,
        products: data.order.products.map((p) => p._id),
        instructions: data.order.instructions,
        totalPrice: total,
        estimatedArrival: 15,
        ...(data.scheduledAt && { scheduledAt: new Date(data.scheduledAt).toISOString() }),
      };

      console.log('Enviando requisição para:', data.scheduledAt ? '/api/deliveries/schedule' : '/api/deliveries', 'com dados:', deliveryData);

      const endpoint = data.scheduledAt ? '/api/deliveries/schedule' : '/api/deliveries';
      const response = await axios.post(endpoint, deliveryData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.delivery || !response.data.delivery._id) {
        throw new Error('ID da entrega não retornado pela API');
      }

      socket.emit('newDeliveryScheduled');
      toast.success('Entrega solicitada com sucesso!');
      reset();
      navigate(`/delivery-status/${response.data.delivery._id}`);
    } catch (error) {
      console.error('Erro na requisição:', {
        message: error.message,
        response: error.response ? error.response.data : null,
        status: error.response ? error.response.status : null,
      });
      toast.error(`Erro ao solicitar entrega: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Nova Entrega</h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.grid}>
            <Card className={styles.card}>
              <CardHeader className={styles.cardHeader}>
                <CardTitle className={styles.cardTitle}>Endereço de Retirada</CardTitle>
              </CardHeader>
              <CardContent className={styles.cardContent}>
                <div className={styles.addressFieldRow}>
                  <AddressFields type="pickup" />
                </div>
              </CardContent>
            </Card>
            <Card className={styles.card}>
              <CardHeader className={styles.cardHeader}>
                <CardTitle className={styles.cardTitle}>Endereço de Entrega</CardTitle>
              </CardHeader>
              <CardContent className={styles.cardContent}>
                <div className={styles.addressFieldRow}>
                  <AddressFields type="delivery" />
                </div>
                <ResidenceTypeSelector />
              </CardContent>
            </Card>
            <Card className={styles.card}>
              <CardHeader className={styles.cardHeader}>
                <CardTitle className={styles.cardTitle}>Destinatário</CardTitle>
              </CardHeader>
              <CardContent className={styles.cardContent}>
                <RecipientInfo />
              </CardContent>
            </Card>
            <Card className={styles.fullWidthCard}>
              <CardHeader className={styles.cardHeader}>
                <CardTitle className={styles.cardTitle}>Detalhes do Pedido</CardTitle>
              </CardHeader>
              <CardContent className={styles.cardContent}>
                <div className={styles.orderDetails}>
                  <ProductList />
                  <OrderInfo />
                  <div className={styles.total}>
                    <p>
                      <strong>Total:</strong> R$ {total.toFixed(2)}
                    </p>
                  </div>
                  <div className={styles.formGroup}>
                    <Label htmlFor="scheduledAt">Agendar Para (opcional)</Label>
                    <Input
                      id="scheduledAt"
                      name="scheduledAt"
                      type="datetime-local"
                      onChange={(e) => setValue('scheduledAt', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Button type="submit" className={styles.submitButton}>
            Solicitar Entrega
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default NewDeliveryPage;