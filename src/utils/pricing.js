// Sistema de precificação do NaHora! - Marketplace de Entregas
// Baseado em: R$ 8,00 base + R$ 1,50/km + multiplicadores por categoria + 15% taxa plataforma

export const PRICING_CONFIG = {
  basePrice: 8.00,        // Tarifa base inicial (aumento de R$ 2,00)
  perKmPrice: 1.50,       // Preço por km adicional
  platformFee: 0.15,      // 15% para a plataforma
  peakHourMultiplier: 1.10, // +10% no horário de pico (18h-20h)
  urgentFee: 2.00,        // Taxa para entrega urgente
  fragileFee: 2.00,       // Taxa para itens frágeis
  thermalFee: 2.00,       // Taxa para baú térmico
};

// Novos multiplicadores por categoria (conforme proposta)
export const CATEGORY_MULTIPLIERS = {
  small: 1.0,       // Pequeno: x1,0
  medium: 1.5,      // Médio: x1,5  
  large: 2.0        // Grande: x2,0
};

// Manter compatibilidade com sistema antigo
export const PACKAGE_MULTIPLIERS = {
  envelope: 1.0,    // Até 1kg - preço base
  small: 1.0,       // Até 2kg - preço base
  medium: 1.5,      // Até 5kg - +50% (novo multiplicador)
  large: 2.0,       // Até 10kg - +100% (novo multiplicador)
  special: 2.0      // Variável - +100% (novo multiplicador)
};

// Atualizar faixas de distância com novo preço base
export const DISTANCE_RANGES = [
  { maxKm: 2, price: 8.00 },    // Novo preço base
  { maxKm: 5, price: 12.50 },   // 8.00 + (3 * 1.50)
  { maxKm: 8, price: 16.50 },   // 8.00 + (6 * 1.50)
  { maxKm: 12, price: 23.00 },  // 8.00 + (10 * 1.50)
  { maxKm: Infinity, price: 30.00 } // Preço máximo
];

/**
 * Calcula a distância entre dois endereços (simulado)
 * Em produção, usar Google Maps API ou similar
 */
export const calculateDistance = (pickupAddress, deliveryAddress) => {
  if (!pickupAddress || !deliveryAddress) return 0;
  
  // Simulação baseada no comprimento dos endereços
  // Em produção, usar API de geocoding
  const baseDistance = Math.random() * 15 + 2; // 2-17km
  return Math.round(baseDistance * 10) / 10; // Arredondar para 1 casa decimal
};

/**
 * Calcula o preço base por distância
 */
export const calculateBasePrice = (distance) => {
  if (distance <= 2) return PRICING_CONFIG.basePrice;
  
  const extraKm = distance - 2;
  return PRICING_CONFIG.basePrice + (extraKm * PRICING_CONFIG.perKmPrice);
};

/**
 * Calcula o preço total da entrega (NOVO MODELO)
 */
export const calculateDeliveryPrice = ({
  distance = 0,
  packageType = 'medium',
  category = 'medium', // Novo parâmetro para categoria
  isPeakHour = false,
  isUrgent = false,
  isFragile = false,
  isThermal = false,
  products = []
}) => {
  // Verificações de segurança
  if (typeof distance !== 'number' || isNaN(distance) || distance < 0) {
    distance = 0;
  }
  
  let totalPrice = 0;
  
  // 1. Preço base por distância
  const basePrice = calculateBasePrice(distance) || 0;
  totalPrice += basePrice;
  
  // 2. Multiplicador do tipo de pacote (compatibilidade)
  const packageMultiplier = PACKAGE_MULTIPLIERS[packageType] || 1.0;
  totalPrice *= packageMultiplier;
  
  // 3. Multiplicador da categoria (NOVO)
  const categoryMultiplier = CATEGORY_MULTIPLIERS[category] || 1.0;
  totalPrice *= categoryMultiplier;
  
  // 4. Taxas especiais
  if (isFragile) totalPrice += PRICING_CONFIG.fragileFee;
  if (isThermal) totalPrice += PRICING_CONFIG.thermalFee;
  if (isUrgent) totalPrice += PRICING_CONFIG.urgentFee;
  
  // 5. Horário de pico
  if (isPeakHour) totalPrice *= PRICING_CONFIG.peakHourMultiplier;
  
  // 6. Preço dos produtos (se houver)
  const productsPrice = products.reduce((total, product) => total + (product.price || 0), 0);
  
  // 7. Cálculo da taxa da plataforma (NOVO)
  const platformFee = totalPrice * PRICING_CONFIG.platformFee;
  const driverEarnings = totalPrice - platformFee;
  
  // Garantir que todos os valores são números válidos
  const safeDeliveryPrice = Math.round((totalPrice || 0) * 100) / 100;
  const safeProductsPrice = Math.round((productsPrice || 0) * 100) / 100;
  const safePlatformFee = Math.round((platformFee || 0) * 100) / 100;
  const safeDriverEarnings = Math.round((driverEarnings || 0) * 100) / 100;
  
  return {
    basePrice: basePrice || 0,
    packageMultiplier: packageMultiplier || 1.0,
    categoryMultiplier: categoryMultiplier || 1.0,
    specialFees: {
      fragile: isFragile ? (PRICING_CONFIG.fragileFee || 0) : 0,
      thermal: isThermal ? (PRICING_CONFIG.thermalFee || 0) : 0,
      urgent: isUrgent ? (PRICING_CONFIG.urgentFee || 0) : 0,
      peakHour: isPeakHour ? (totalPrice * ((PRICING_CONFIG.peakHourMultiplier || 1) - 1)) : 0
    },
    productsPrice: safeProductsPrice,
    deliveryPrice: safeDeliveryPrice,
    totalPrice: safeDeliveryPrice + safeProductsPrice,
    // NOVOS CAMPOS
    platformFee: safePlatformFee,
    driverEarnings: safeDriverEarnings
  };
};

/**
 * Verifica se está no horário de pico (18h-20h)
 */
export const isPeakHour = () => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 18 && hour < 20;
};

/**
 * Calcula o tempo estimado de entrega baseado na distância
 */
export const calculateEstimatedTime = (distance) => {
  if (distance <= 2) return '15-20 min';
  if (distance <= 5) return '20-30 min';
  if (distance <= 8) return '30-40 min';
  if (distance <= 12) return '40-50 min';
  return '50+ min';
};

/**
 * Formata o preço para exibição
 */
export const formatPrice = (price) => {
  // Verificação mais robusta
  if (price === undefined || price === null || isNaN(price) || typeof price !== 'number') {
    return 'R$ 0,00';
  }
  
  // Garantir que é um número válido
  const numPrice = Number(price);
  if (isNaN(numPrice)) {
    return 'R$ 0,00';
  }
  
  return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
};

/**
 * Calcula a divisão de receita (NOVO MODELO)
 */
export const calculateRevenueSplit = (totalPrice) => {
  const platformFee = totalPrice * PRICING_CONFIG.platformFee; // 15% para plataforma
  const driverFee = totalPrice * (1 - PRICING_CONFIG.platformFee); // 85% para entregador
  
  return {
    platform: Math.round(platformFee * 100) / 100,
    driver: Math.round(driverFee * 100) / 100,
    total: totalPrice,
    platformPercentage: PRICING_CONFIG.platformFee * 100,
    driverPercentage: (1 - PRICING_CONFIG.platformFee) * 100
  };
};

/**
 * Gera um resumo detalhado da precificação
 */
export const generatePricingSummary = (deliveryData) => {
  const distance = calculateDistance(deliveryData.pickupAddress, deliveryData.deliveryAddress);
  const pricing = calculateDeliveryPrice({
    distance,
    packageType: deliveryData.packageType,
    category: deliveryData.category || deliveryData.packageType, // Usar categoria se disponível
    isPeakHour: isPeakHour(),
    isUrgent: deliveryData.isUrgent,
    isFragile: deliveryData.isFragile,
    isThermal: deliveryData.isThermal,
    products: deliveryData.products || []
  });
  
  const revenueSplit = calculateRevenueSplit(pricing.deliveryPrice); // Usar deliveryPrice, não totalPrice
  const estimatedTime = calculateEstimatedTime(distance);
  
  return {
    distance,
    estimatedTime,
    pricing,
    revenueSplit,
    breakdown: {
      basePrice: pricing.basePrice,
      packageMultiplier: pricing.packageMultiplier,
      categoryMultiplier: pricing.categoryMultiplier,
      specialFees: pricing.specialFees,
      productsPrice: pricing.productsPrice,
      deliveryPrice: pricing.deliveryPrice,
      totalPrice: pricing.totalPrice,
      platformFee: pricing.platformFee,
      driverEarnings: pricing.driverEarnings
    }
  };
};

/**
 * Gera simulação de preços conforme proposta do modelo de negócio
 */
export const generatePricingSimulation = () => {
  const distances = [1, 3, 5];
  const categories = ['small', 'medium', 'large'];
  const simulation = [];
  
  distances.forEach(distance => {
    categories.forEach(category => {
      const pricing = calculateDeliveryPrice({
        distance,
        category,
        isPeakHour: false,
        isUrgent: false,
        isFragile: false,
        isThermal: false,
        products: []
      });
      
      const revenueSplit = calculateRevenueSplit(pricing.deliveryPrice);
      
      simulation.push({
        distance: `${distance} km`,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        totalPrice: pricing.deliveryPrice,
        platformFee: revenueSplit.platform,
        driverEarnings: revenueSplit.driver,
        platformPercentage: revenueSplit.platformPercentage,
        driverPercentage: revenueSplit.driverPercentage
      });
    });
  });
  
  return simulation;
};
