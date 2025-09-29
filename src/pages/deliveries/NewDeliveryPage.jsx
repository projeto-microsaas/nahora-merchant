import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import AddressFields from '../../components/merchant/delivery/AddressFields';
import CommercialAddressSelector from '../../components/merchant/delivery/CommercialAddressSelector';
import RecipientInfo from '../../components/merchant/delivery/RecipientInfo';
import ProductList from '../../components/merchant/delivery/ProductList';
import OrderInfo from '../../components/merchant/delivery/OrderInfo';
import { toast } from 'sonner';
import axios from '../../lib/axios';
import { ShoppingCart, Package, MapPin, User, FileText, Truck, Clock, DollarSign } from 'lucide-react';
import styles from './NewDeliveryPage.module.css';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { calculateDeliveryPrice, calculateRevenueSplit, formatPrice } from '../../utils/pricing';

const NewDeliveryFormPage = () => {
  
  const methods = useForm({
    defaultValues: {
      pickupAddress: { type: '', street: '', number: '', neighborhood: '' },
      deliveryAddress: { type: '', street: '', number: '', neighborhood: '', residenceType: '', apartment: '' },
      recipient: { name: '', phone: '' },
      order: { products: [], instructions: '', total: 0, packageType: '' },
      scheduledAt: '',
    },
    mode: "onChange",
  });

  const navigate = useNavigate();
  const { handleSubmit, reset, watch, setValue } = methods;
  
  const [selectedPackageType, setSelectedPackageType] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedDistance, setSelectedDistance] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedCommercialAddress, setSelectedCommercialAddress] = useState(null);

  // Carregar produtos do backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('🔍 Iniciando busca de produtos...');
      const token = localStorage.getItem('authToken');
      console.log('🔑 Token encontrado:', token ? 'Sim' : 'Não');
      
      const response = await axios.get('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Resposta da API recebida:', response.status);
      console.log('📦 Dados dos produtos:', response.data);
      console.log('📊 Tipo dos dados:', typeof response.data);
      console.log('📋 É array?', Array.isArray(response.data));
      
      // A API retorna diretamente um array de produtos
      let products = [];
      if (Array.isArray(response.data)) {
        products = response.data;
        console.log('✅ Produtos extraídos do array:', products);
      } else {
        console.log('❌ Dados não são um array:', response.data);
        products = [];
      }
      
      // Adicionar ícones padrão se não existirem
      const productsWithIcons = products.map(product => {
        const icon = product.icon || categoryIcons[product.category] || '📦';
        console.log('🔍 Processando produto:', product.name, 'Categoria:', product.category, 'Ícone:', icon);
        return {
          ...product,
          icon: icon,
          category: product.category || 'Geral'
        };
      });
      
      console.log('🎨 Produtos com ícones:', productsWithIcons);
      setAvailableProducts(productsWithIcons);
      
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error);
      console.error('📋 Status do erro:', error.response?.status);
      console.error('📄 Dados do erro:', error.response?.data);
      console.error('🔗 URL da requisição:', error.config?.url);
      
      // Produtos padrão caso não consiga carregar
      const defaultProducts = [
        { _id: 1, name: 'Refrigerante', price: 2.00, icon: '🥤', category: 'Bebida' },
        { _id: 2, name: 'Pizza', price: 30.00, icon: '🍕', category: 'Alimento' },
        { _id: 3, name: 'Hambúrguer', price: 15.00, icon: '🍔', category: 'Alimento' }
      ];
      
      console.log('🔄 Usando produtos padrão:', defaultProducts);
      setAvailableProducts(defaultProducts);
    }
  };

  // Opções de pacote com novos multiplicadores (NOVO MODELO)
  const packageOptions = {
    'small': { label: 'Pequeno', multiplier: 1.0, icon: '📦', desc: '× 1,0 (preço base)', color: '#10B981' },
    'medium': { label: 'Médio', multiplier: 1.5, icon: '📦', desc: '× 1,5 (+50%)', color: '#F59E0B' },
    'large': { label: 'Grande', multiplier: 2.0, icon: '📦', desc: '× 2,0 (+100%)', color: '#EF4444' }
  };

  // Opções de distância com novo sistema (NOVO MODELO)
  const distanceOptions = {
    '1': { label: '1 km', distance: 1, icon: '🚶', desc: 'R$ 8,00 base', color: '#3B82F6' },
    '3': { label: '3 km', distance: 3, icon: '🚴', desc: 'R$ 8,00 + R$ 1,50/km', color: '#10B981' },
    '5': { label: '5 km', distance: 5, icon: '🏃', desc: 'R$ 8,00 + R$ 4,50', color: '#F59E0B' },
    '8': { label: '8 km', distance: 8, icon: '🚗', desc: 'R$ 8,00 + R$ 9,00', color: '#EF4444' },
    '12': { label: '12 km', distance: 12, icon: '🚛', desc: 'R$ 8,00 + R$ 15,00', color: '#8B5CF6' }
  };

  const handlePackageSelect = (packageType) => {
    if (selectedPackageType === packageType) {
      setSelectedPackageType('');
      setValue('order.packageType', '');
    } else {
      setSelectedPackageType(packageType);
      setValue('order.packageType', packageType);
    }
  };

  const handleDistanceSelect = (distanceKey) => {
    if (selectedDistance === distanceKey) {
      setSelectedDistance('');
      setValue('order.distance', '');
    } else {
      setSelectedDistance(distanceKey);
      setValue('order.distance', distanceKey);
    }
  };

  const handleCommercialAddressSelect = (addressId) => {
    setSelectedCommercialAddress(addressId);
    console.log('Endereço comercial selecionado:', addressId);
  };

  // Função para calcular preço usando o novo sistema
  const calculateNewPrice = () => {
    if (!selectedDistance || !selectedPackageType) {
      return { 
        deliveryPrice: 0, 
        platformFee: 0, 
        driverEarnings: 0, 
        totalPrice: 0 
      };
    }
    
    const distance = distanceOptions[selectedDistance]?.distance || 0;
    const category = selectedPackageType; // small, medium, large
    
    try {
      const pricing = calculateDeliveryPrice({
        distance,
        category,
        isPeakHour: false,
        isUrgent: false,
        isFragile: false,
        isThermal: false,
        products: selectedProducts
      });
      
      const revenueSplit = calculateRevenueSplit(pricing.deliveryPrice || 0);
      
      return {
        deliveryPrice: pricing.deliveryPrice || 0,
        platformFee: revenueSplit.platform || 0,
        driverEarnings: revenueSplit.driver || 0,
        totalPrice: pricing.totalPrice || 0
      };
    } catch (error) {
      console.error('Erro ao calcular preço:', error);
      return { 
        deliveryPrice: 0, 
        platformFee: 0, 
        driverEarnings: 0, 
        totalPrice: 0 
      };
    }
  };

  // Mapeamento de ícones por categoria
  const categoryIcons = {
    'Alimento': '🍽️',
    'Bebida': '🥤',
    'Eletrônico': '📱',
    'Roupa': '👕',
    'Casa': '🏠',
    'Saúde': '💊',
    'Livro': '📚',
    'Esporte': '⚽',
    'Beleza': '💄',
    'Outros': '📦',
    'Sem Categoria': '📦'
  };

  const getProductIcon = (product) => {
    console.log('🔍 Debug produto:', product.name, 'Categoria:', product.category, 'Ícone produto:', product.icon);
    const icon = product.icon || categoryIcons[product.category] || '📦';
    console.log('🎯 Ícone final:', icon);
    return icon;
  };

  const handleProductSelect = (product) => {
    const productId = product._id || product.id;
    const isSelected = selectedProducts.find(p => (p._id || p.id) === productId);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter(p => (p._id || p.id) !== productId));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => (p._id || p.id) !== productId));
  };

  const handleManageProducts = () => {
    window.open('/add-product', '_blank');
  };

  const handleRefreshProducts = () => {
    fetchProducts();
  };

  const onSubmit = async (data) => {
    try {
      console.log('🚀 Iniciando criação de entrega...');
      const token = localStorage.getItem('authToken');
      console.log('🔑 Token encontrado:', token ? 'Sim' : 'Não');
      console.log('📦 Dados originais:', data);
      
      // Transformar dados do formulário para o formato esperado pelo backend
      const pickupAddr = data.pickupAddress ? 
        `${data.pickupAddress.type} ${data.pickupAddress.street}, ${data.pickupAddress.number} - ${data.pickupAddress.neighborhood}` : '';
      const deliveryAddr = data.deliveryAddress ? 
        `${data.deliveryAddress.type} ${data.deliveryAddress.street}, ${data.deliveryAddress.number} - ${data.deliveryAddress.neighborhood}` : '';
      
      const deliveryData = {
        customer: data.recipient?.name || '',
        phone: data.recipient?.phone || '',
        address: `${pickupAddr} → ${deliveryAddr}`, // Campo obrigatório para compatibilidade
        pickupAddress: pickupAddr,
        deliveryAddress: deliveryAddr,
        packageType: selectedPackageType || 'medium',
        products: selectedProducts.map(p => p._id || p.id).filter(Boolean).map(id => {
          // Se for um número (produto padrão), não incluir no array
          if (typeof id === 'number') return null;
          return id;
        }).filter(Boolean),
        instructions: data.order?.instructions || '',
        totalPrice: Number(calculateNewPrice().totalPrice),
        estimatedArrival: 35
      };
      
      console.log('📦 Dados transformados:', deliveryData);
      
      const response = await axios.post('/api/deliveries', deliveryData);
      console.log('✅ Entrega criada com sucesso:', response.data);
      
      if (response.data && response.data.delivery) {
        toast.success('Entrega solicitada com sucesso!');
        reset();
        // Redirecionar para a página de status da entrega
        navigate(`/delivery-status/${response.data.delivery._id}`);
      }
    } catch (error) {
      console.error('❌ Erro ao criar entrega:', error);
      console.error('📋 Status do erro:', error.response?.status);
      console.error('📄 Dados do erro:', error.response?.data);
      console.error('🔗 URL da requisição:', error.config?.url);
      console.error('📤 Headers enviados:', error.config?.headers);
      
      toast.error('Erro ao solicitar entrega. Tente novamente.');
    }
  };

  return (
    <DashboardLayout>
      <h1 className={styles.pageTitle}>Nova Entrega</h1>
          
          {/* Indicador de Passos */}
          <div className={styles.stepsIndicator}>
            <div className={styles.stepsContainer}>
              <div className={`${styles.step} ${selectedProducts.length > 0 ? styles.completed : ''}`}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepLabel}>Produto</div>
              </div>
              <div className={styles.stepConnector}></div>
              <div className={`${styles.step} ${selectedPackageType ? styles.completed : ''}`}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepLabel}>Pacote</div>
              </div>
              <div className={styles.stepConnector}></div>
              <div className={`${styles.step} ${selectedDistance ? styles.completed : ''}`}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepLabel}>Taxa</div>
              </div>
              <div className={styles.stepConnector}></div>
              <div className={`${styles.step} ${watch('pickupAddress.street') && watch('deliveryAddress.street') ? styles.completed : ''}`}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepLabel}>Endereço</div>
              </div>
              <div className={styles.stepConnector}></div>
              <div className={`${styles.step} ${watch('recipient.name') && watch('recipient.phone') ? styles.completed : ''}`}>
                <div className={styles.stepNumber}>5</div>
                <div className={styles.stepLabel}>Cliente</div>
              </div>
              <div className={styles.stepConnector}></div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>6</div>
                <div className={styles.stepLabel}>Confirmar</div>
              </div>
            </div>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.formColumn}>
                  
                  {/* Seção de Produtos */}
                  <Card className={styles.card}>
                    <CardHeader className={styles.cardHeader}>
                      <div className={styles.cardHeaderContent}>
                        <CardTitle className={styles.cardTitle}>Produtos da Entrega</CardTitle>
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleManageProducts}
                          className={styles.manageProductsButton}
                        >
                          <ShoppingCart className={styles.buttonIcon} />
                          Gerenciar Produtos
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className={styles.cardContent}>
                      {selectedProducts.length > 0 && (
                        <div className={styles.selectedProductsSection}>
                          <h4 className={styles.sectionTitle}>Produtos Selecionados</h4>
                          <div className={styles.selectedProductsList}>
                            {selectedProducts.map((product) => (
                              <div key={product._id || product.id} className={styles.selectedProductItem}>
                                <span className={styles.productTag}>
                                  {getProductIcon(product)} {product.name} - R$ {product.price.toFixed(2)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProduct(product._id || product.id)}
                                  className={styles.removeButton}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className={styles.productGrid}>
                        {availableProducts.map((product) => {
                          const productId = product._id || product.id;
                          const isSelected = selectedProducts.find(p => (p._id || p.id) === productId);
                          return (
                            <div
                              key={productId}
                              className={`${styles.productCard} ${isSelected ? styles.selected : ''}`}
                              onClick={() => handleProductSelect(product)}
                            >
                              <div className={styles.productIcon}>{getProductIcon(product)}</div>
                              <div className={styles.productInfo}>
                                <div className={styles.productName}>{product.name}</div>
                                <div className={styles.productCategory}>{product.category}</div>
                                <div className={styles.productPrice}>R$ {product.price.toFixed(2)}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Seção de Tipo de Pacote */}
                  <Card className={styles.card}>
                    <CardHeader className={styles.cardHeader}>
                      <div className={styles.packageHeader}>
                        <div className={styles.packageIcon}>🚛</div>
                        <CardTitle className={styles.cardTitle}>Tipo de Pacote</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className={styles.cardContent}>
                      <div className={styles.packageOptions}>
                        {Object.entries(packageOptions).map(([key, option]) => (
                          <div
                            key={key}
                            className={`${styles.packageCard} ${selectedPackageType === key ? styles.selected : ''}`}
                            onClick={() => handlePackageSelect(key)}
                            style={{ borderColor: selectedPackageType === key ? option.color : '#e5e7eb' }}
                          >
                            <div className={styles.packageIcon} style={{ color: option.color }}>
                              {option.icon}
                            </div>
                            <div className={styles.packageInfo}>
                              <div className={styles.packageLabel}>{option.label}</div>
                              <div className={styles.packageDesc}>{option.desc}</div>
                              <div className={styles.packagePrice} style={{ color: option.color }}>
                                {option.multiplier}x
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Seção de Taxa de Distância */}
                  <Card className={styles.card}>
                    <CardHeader className={styles.cardHeader}>
                      <CardTitle className={styles.cardTitle}>Taxa de Distância</CardTitle>
                    </CardHeader>
                    <CardContent className={styles.cardContent}>
                      <div className={styles.distanceGrid}>
                        {Object.entries(distanceOptions).map(([key, option]) => (
                          <div
                            key={key}
                            className={`${styles.distanceCard} ${selectedDistance === key ? styles.selected : ''}`}
                            onClick={() => handleDistanceSelect(key)}
                            style={{ borderColor: selectedDistance === key ? option.color : '#e5e7eb' }}
                          >
                            <div className={styles.distanceIcon} style={{ color: option.color }}>
                              {option.icon}
                            </div>
                            <div className={styles.distanceInfo}>
                              <div className={styles.distanceLabel}>{option.label}</div>
                              <div className={styles.distanceDesc}>{option.desc}</div>
                              <div className={styles.distancePrice} style={{ color: option.color }}>
                                {(() => {
                                  try {
                                    const pricing = calculateDeliveryPrice({
                                      distance: option.distance,
                                      category: 'small', // Usar small como base para preview
                                      products: []
                                    });
                                    return formatPrice(pricing.deliveryPrice || 0);
                                  } catch (error) {
                                    return 'R$ 0,00';
                                  }
                                })()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Seção de Endereços */}
                  <Card className={styles.card}>
                    <CardHeader className={styles.cardHeader}>
                      <CardTitle className={styles.cardTitle}>
                        <MapPin className={styles.titleIcon} />
                        Endereços de Coleta e Entrega
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={styles.cardContent}>
                      <div className={styles.addressContainer}>
                        <div className={styles.addressSection}>
                          <CommercialAddressSelector 
                            onSelect={handleCommercialAddressSelect}
                            selectedValue={selectedCommercialAddress}
                          />
                        </div>

                        <div className={styles.addressSection}>
                          <div className={styles.addressHeader}>
                            <h4 className={styles.addressTitle}>Entrega</h4>
                          </div>
                          <div className={styles.addressFieldRow}>
                            <AddressFields type="delivery" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Seção de Cliente e Instruções */}
                  <Card className={styles.card}>
                    <CardHeader className={styles.cardHeader}>
                      <CardTitle className={styles.cardTitle}>
                        <User className={styles.titleIcon} />
                        Dados do Cliente e Instruções
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={styles.cardContent}>
                      <div className={styles.clientContainer}>
                        <div className={styles.clientSection}>
                          <h4 className={styles.sectionTitle}>👤 Dados do Cliente</h4>
                          <RecipientInfo />
                        </div>
                        
                        <div className={styles.instructionsSection}>
                          <h4 className={styles.sectionTitle}>📝 Instruções Especiais</h4>
                          <div className={styles.formGroup}>
                            <Label htmlFor="instructions">Instruções (Opcional)</Label>
                            <Input
                              id="instructions"
                              placeholder="Ex: Entregar na portaria, não tocar a campainha, deixar com o porteiro..."
                              {...methods.register('order.instructions')}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Seção de Resumo Final */}
                  <Card className={styles.finalSummaryCard}>
                  <CardHeader className={styles.cardHeader}>
                    <CardTitle className={styles.cardTitle}>
                      <Truck className={styles.titleIcon} />
                      Resumo Final da Entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={styles.cardContent}>
                    <div className={styles.summaryGrid}>
                      <div className={styles.summaryItem}>
                        <Package className={styles.summaryIcon} />
                        <div className={styles.summaryText}>
                          <strong>Produtos:</strong> {selectedProducts.length} item(s)
                          {selectedProducts.length > 0 && (
                            <div className={styles.selectedProductsList}>
                              {selectedProducts.map(product => (
                                <span key={product._id || product.id} className={styles.productTag}>
                                  {getProductIcon(product)} {product.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={styles.summaryItem}>
                        <Clock className={styles.summaryIcon} />
                        <div className={styles.summaryText}>
                          <strong>Tempo Estimado:</strong> 30-40 min
                        </div>
                      </div>
                      <div className={styles.summaryItem}>
                        <DollarSign className={styles.summaryIcon} />
                        <div className={styles.summaryText}>
                          <strong>Valor da Entrega:</strong> {formatPrice(calculateNewPrice().deliveryPrice)}
                        </div>
                      </div>
                      
                      <div className={styles.summaryItem}>
                        <div className={styles.summaryIcon} style={{ color: '#ea580c' }}>🏢</div>
                        <div className={styles.summaryText}>
                          <strong>Taxa Plataforma (15%):</strong> {formatPrice(calculateNewPrice().platformFee)}
                        </div>
                      </div>
                      
                      <div className={styles.summaryItem}>
                        <div className={styles.summaryIcon} style={{ color: '#7c3aed' }}>🚚</div>
                        <div className={styles.summaryText}>
                          <strong>Entregador (85%):</strong> {formatPrice(calculateNewPrice().driverEarnings)}
                        </div>
                      </div>
                      
                      <div className={styles.summaryItem}>
                        <DollarSign className={styles.summaryIcon} style={{ color: '#16a34a' }} />
                        <div className={styles.summaryText}>
                          <strong>Valor Total:</strong> {formatPrice(calculateNewPrice().totalPrice)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Botão de Envio */}
                <div className={styles.submitSection}>
                  <Button 
                    type="submit" 
                    className={styles.submitButton}
                    size="lg"
                  >
                    <Truck className={styles.buttonIcon} />
                    Solicitar Entrega
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
    </DashboardLayout>
  );
};

export default NewDeliveryFormPage;
