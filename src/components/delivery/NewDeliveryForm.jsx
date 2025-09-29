import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Clock, MapPin, Package, DollarSign, Truck } from 'lucide-react';
import PackageTypeSelector from './PackageTypeSelector';
import AddressForm from './AddressForm';
import ProductSelector from './ProductSelector';
import axios from '@/lib/axios';

const NewDeliveryForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    customerName: '',
    customerPhone: '',
    instructions: '',
    scheduledAt: ''
  });
  
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [specialOptions, setSpecialOptions] = useState({
    isFragile: false,
    isThermal: false,
    isUrgent: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('15-30 min');

  // Calcular preço estimado
  useEffect(() => {
    let totalPrice = 0;
    
    // Preço dos produtos selecionados
    const productsPrice = selectedProducts.reduce((total, product) => total + product.price, 0);
    
    // Preço base do pacote (se selecionado)
    if (selectedPackage) {
      let basePrice = selectedPackage.basePrice;
      let extraPrice = 0;
      
      if (specialOptions.isFragile) extraPrice += 2.00;
      if (specialOptions.isThermal) extraPrice += 2.00;
      if (specialOptions.isUrgent) extraPrice += 3.00;
      
      // Simular cálculo de distância (em produção, usar API de mapas)
      const distance = calculateDistance(formData.pickupAddress, formData.deliveryAddress);
      const distancePrice = Math.max(0, (distance - 2) * 1.00); // R$ 1,00 por km após 2km
      
      totalPrice = basePrice + extraPrice + distancePrice;
      
      // Atualizar tempo estimado baseado na distância
      if (distance > 10) {
        setEstimatedTime('30-45 min');
      } else if (distance > 5) {
        setEstimatedTime('20-35 min');
      } else {
        setEstimatedTime('15-30 min');
      }
    } else {
      // Se não há pacote selecionado, usar preço base
      totalPrice = 5.00; // Preço mínimo
    }
    
    setEstimatedPrice(totalPrice);
  }, [selectedPackage, selectedProducts, specialOptions, formData.pickupAddress, formData.deliveryAddress]);

  const calculateDistance = (pickup, delivery) => {
    // Simulação simples - em produção usar Google Maps API
    if (!pickup || !delivery) return 0;
    return Math.random() * 15 + 2; // 2-17km
  };

  const handlePackageSelect = (pkg, options = specialOptions) => {
    setSelectedPackage(pkg);
    setSpecialOptions(options);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      toast.error('Selecione pelo menos um produto');
      return;
    }
    
    if (!formData.pickupAddress || !formData.deliveryAddress) {
      toast.error('Preencha os endereços de coleta e entrega');
      return;
    }
    
    if (!formData.customerName || !formData.customerPhone) {
      toast.error('Preencha os dados do cliente');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const merchantId = payload.id;

      const deliveryData = {
        customer: formData.customerName,
        phone: formData.customerPhone,
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        products: selectedProducts.map(p => p._id), // IDs dos produtos
        packageType: selectedPackage?.id || 'medium',
        packageDetails: selectedPackage ? {
          name: selectedPackage.name,
          weight: selectedPackage.weight,
          transport: selectedPackage.transport,
          specialOptions: specialOptions
        } : null,
        instructions: formData.instructions,
        totalPrice: estimatedPrice,
        estimatedArrival: 30, // minutos
        merchantId: merchantId,
        ...(formData.scheduledAt && { scheduledAt: new Date(formData.scheduledAt).toISOString() })
      };

      const endpoint = formData.scheduledAt ? '/api/deliveries/schedule' : '/api/deliveries';
      const response = await axios.post(endpoint, deliveryData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Entrega solicitada com sucesso!');
      
      if (onSuccess) {
        onSuccess(response.data.delivery);
      }
      
      // Reset form
      setFormData({
        pickupAddress: '',
        deliveryAddress: '',
        customerName: '',
        customerPhone: '',
        instructions: '',
        scheduledAt: ''
      });
      setSelectedPackage(null);
      setSelectedProducts([]);
      setSpecialOptions({ isFragile: false, isThermal: false, isUrgent: false });
      
    } catch (error) {
      console.error('Erro ao criar entrega:', error);
      toast.error(error.response?.data?.message || 'Erro ao solicitar entrega');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-2">
          🚀 Já Vai! - Nova Entrega
        </h1>
        <p className="text-gray-600">
          Logística sob demanda - Simples, rápido e confiável
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Endereços */}
        <AddressForm
          pickupAddress={formData.pickupAddress}
          deliveryAddress={formData.deliveryAddress}
          onPickupChange={(value) => setFormData({ ...formData, pickupAddress: value })}
          onDeliveryChange={(value) => setFormData({ ...formData, deliveryAddress: value })}
        />

        {/* Seleção de Produtos */}
        <ProductSelector
          selectedProducts={selectedProducts}
          onProductsChange={setSelectedProducts}
        />

        {/* Tipo de Pacote */}
        <PackageTypeSelector
          selectedPackage={selectedPackage}
          onPackageSelect={handlePackageSelect}
          specialOptions={specialOptions}
        />

        {/* Dados do Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👤 Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Nome do Cliente</Label>
                <Input
                  id="customerName"
                  placeholder="Ex: João Silva"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Telefone</Label>
                <Input
                  id="customerPhone"
                  placeholder="Ex: (11) 99999-9999"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruções e Agendamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📝 Instruções e Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="instructions">Instruções Especiais</Label>
              <Textarea
                id="instructions"
                placeholder="Ex: Deixar na portaria, ligar antes de entregar, item frágil..."
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="scheduledAt">Agendar Para (opcional)</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Resumo e Preço */}
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💰 Resumo da Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {estimatedPrice.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Tempo Estimado</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {estimatedTime}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant="outline" className="text-orange-600">
                    {formData.scheduledAt ? 'Agendado' : 'Imediato'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão de Envio */}
        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
            disabled={isSubmitting || selectedProducts.length === 0}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Solicitando...
              </>
            ) : (
              <>
                🚀 Solicitar Entrega
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewDeliveryForm;
