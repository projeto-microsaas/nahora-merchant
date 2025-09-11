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
import AppSidebar from '../../components/layout/AppSidebar';
import { SidebarProvider } from '../../components/ui/sidebar';

const NewDeliveryPage = () => {
  const methods = useForm({
    defaultValues: {
      pickupAddress: { type: '', street: '', number: '', neighborhood: '' },
      deliveryAddress: { type: '', street: '', number: '', neighborhood: '', residenceType: '', apartment: '' },
      recipient: { name: '', phone: '' },
      order: { products: [], instructions: '', total: 0 },
      scheduledAt: '',
    },
    mode: "onChange", // Validação em tempo real
  });
  const navigate = useNavigate();
  const { handleSubmit, reset, watch, setValue } = methods;

  const selectedProducts = watch('order.products') || [];
  const total = selectedProducts.reduce((sum, product) => sum + (product.price * (product.quantity || 1)), 0);

  // Notificação de falha no WebSocket
  socket.on('connect_error', (err) => {
    console.error('Falha na conexão WebSocket:', err.message);
    toast.error('Não foi possível conectar ao servidor de notificações');
  });

  const onSubmit = async (data) => {
    try {
      // Validações extras (fallback)
      if (!data.order.products || data.order.products.length === 0) {
        throw new Error('A entrega deve conter pelo menos um produto.');
      }
      if (!data.recipient.name?.trim()) throw new Error('Nome do destinatário é obrigatório.');
      if (!data.recipient.phone?.trim()) throw new Error('Telefone é obrigatório.');
      if (!data.deliveryAddress.street || !data.deliveryAddress.number || !data.deliveryAddress.neighborhood) {
        throw new Error('Endereço de entrega incompleto.');
      }
      console.log('Produtos selecionados:', data.order.products);
      if (!data.order.products.every(p => p._id && /^[0-9a-fA-F]{24}$/.test(p._id))) {
        throw new Error('Um ou mais IDs de produtos são inválidos.');
      }

      // Validação de scheduledAt corrigida
      let scheduledAtIso = null;
      if (data.scheduledAt) {
        const scheduledDateLocal = new Date(data.scheduledAt + ':00');
        const nowLocal = new Date();
        console.log('Data agendada raw (local):', data.scheduledAt);
        console.log('Data agendada local:', scheduledDateLocal.toLocaleString());
        console.log('Data atual local:', nowLocal.toLocaleString());
        if (isNaN(scheduledDateLocal.getTime())) throw new Error('Data de agendamento inválida.');
        
        const scheduledOnlyDate = new Date(scheduledDateLocal.getFullYear(), scheduledDateLocal.getMonth(), scheduledDateLocal.getDate());
        const nowOnlyDate = new Date(nowLocal.getFullYear(), nowLocal.getMonth(), nowLocal.getDate());
        if (scheduledOnlyDate < nowOnlyDate) {
          throw new Error('Data de agendamento deve ser futura ou atual.');
        }
        
        scheduledAtIso = scheduledDateLocal.toISOString();
        console.log('Data agendada ISO final (UTC):', scheduledAtIso);
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      // Decodificar JWT para merchantId
      let merchantId;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        merchantId = payload.userId || payload.id || payload._id;
        console.log('Token decodificado:', payload);
        if (!merchantId) throw new Error('ID do comerciante não encontrado no token.');
      } catch (err) {
        console.error('Erro ao decodificar token:', err);
        throw new Error('Token inválido ou corrompido.');
      }

      // Validação extra de produtos por merchantId (frontend fallback)
      const invalidProducts = data.order.products.filter(p => !p.merchantId || p.merchantId !== merchantId);
      if (invalidProducts.length > 0) {
        throw new Error('Um ou mais produtos não pertencem ao comerciante. Selecione produtos válidos.');
      }

      const deliveryData = {
        customer: data.recipient.name.trim(),
        phone: data.recipient.phone.trim(),
        address: `${data.deliveryAddress.street}, ${data.deliveryAddress.number}, ${data.deliveryAddress.neighborhood}${
          data.deliveryAddress.apartment ? `, Apt ${data.deliveryAddress.apartment}` : ''
        }`.trim(),
        products: data.order.products.map((p) => p._id),
        instructions: data.order.instructions?.trim() || '',
        totalPrice: Number(total.toFixed(2)),
        estimatedArrival: 15, // Número de minutos, conforme schema
        merchantId: merchantId, // Obrigatório conforme schema
        ...(scheduledAtIso && { scheduledAt: scheduledAtIso }),
      };

      console.log('Enviando requisição para:', data.scheduledAt ? '/api/deliveries/schedule' : '/api/deliveries');
      console.log('Payload enviado:', JSON.stringify(deliveryData, null, 2));

      const endpoint = data.scheduledAt ? '/api/deliveries/schedule' : '/api/deliveries';
      const response = await axios.post(endpoint, deliveryData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.delivery || !response.data.delivery._id) {
        throw new Error('ID da entrega não retornado pela API');
      }

      if (socket.connected) {
        socket.emit('newDeliveryScheduled');
      } else {
        console.warn('WebSocket não está conectado. Tentando reconectar...');
        socket.connect();
        socket.on('connect', () => {
          socket.emit('newDeliveryScheduled');
        });
      }

      toast.success('Entrega solicitada com sucesso!');
      reset();
      navigate(`/delivery-status/${response.data.delivery._id}`);
    } catch (error) {
      console.error('Erro completo na requisição:', error);
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.errors?.[0]?.message ||
                          error.message;
      console.error('Resposta do servidor:', error.response?.data);
      console.error('Status:', error.response?.status);
      // Exibe erros específicos de campos se o backend enviar
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, msg]) => {
          toast.error(`${field}: ${msg.message || msg}`);
        });
      } else {
        toast.error(`Erro ao solicitar entrega: ${errorMessage}`);
      }
    }
  };

  return (
    <SidebarProvider>
      <div className={styles.pageContainer}>
        <AppSidebar className={styles.sidebar} />
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Nova Entrega</h1>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.grid}>
                <Card className={styles.card}>
                  <CardHeader className={styles.cardHeader}>
                    <CardTitle className={styles.cardTitle}>Endereço de Retirada (Opcional)</CardTitle>
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
      </div>
    </SidebarProvider>
  );
};

export default NewDeliveryPage;