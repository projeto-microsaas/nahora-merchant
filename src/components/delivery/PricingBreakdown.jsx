import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  MapPin, 
  Package, 
  Clock, 
  TrendingUp,
  Info
} from 'lucide-react';

const PricingBreakdown = ({ 
  distance, 
  packageType, 
  selectedProducts, 
  isPeakHour, 
  specialOptions = {} 
}) => {
  if (!selectedProducts || selectedProducts.length === 0) {
    return null;
  }

  // Cálculos básicos
  const basePrice = distance <= 2 ? 6.00 : 6.00 + ((distance - 2) * 1.50);
  const packageMultipliers = {
    envelope: 1.0,
    small: 1.0,
    medium: 1.05,
    large: 1.10,
    special: 1.15
  };
  
  const packageMultiplier = packageMultipliers[packageType] || 1.0;
  const packagePrice = basePrice * packageMultiplier;
  
  const specialFees = {
    fragile: specialOptions.isFragile ? 2.00 : 0,
    thermal: specialOptions.isThermal ? 2.00 : 0,
    urgent: specialOptions.isUrgent ? 2.00 : 0
  };
  
  const peakHourFee = isPeakHour ? packagePrice * 0.10 : 0;
  const productsPrice = selectedProducts.reduce((total, product) => total + product.price, 0);
  
  const totalSpecialFees = Object.values(specialFees).reduce((sum, fee) => sum + fee, 0);
  const deliveryPrice = packagePrice + totalSpecialFees + peakHourFee;
  const totalPrice = deliveryPrice + productsPrice;

  const formatPrice = (price) => `R$ ${price.toFixed(2).replace('.', ',')}`;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <DollarSign className="h-5 w-5" />
          Detalhamento de Preços
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações básicas */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>Distância:</span>
            <Badge variant="outline">{distance.toFixed(1)}km</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <span>Pacote:</span>
            <Badge variant="outline">{packageType || 'Médio'}</Badge>
          </div>
        </div>

        {/* Breakdown de preços */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Taxa base ({distance <= 2 ? 'até 2km' : `${distance.toFixed(1)}km`}):</span>
            <span className="font-medium">{formatPrice(basePrice)}</span>
          </div>
          
          {packageMultiplier > 1.0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Multiplicador pacote (+{((packageMultiplier - 1) * 100).toFixed(0)}%):</span>
              <span className="font-medium text-orange-600">
                +{formatPrice(packagePrice - basePrice)}
              </span>
            </div>
          )}
          
          {specialFees.fragile > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Taxa frágil:</span>
              <span className="font-medium text-red-600">+{formatPrice(specialFees.fragile)}</span>
            </div>
          )}
          
          {specialFees.thermal > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Taxa térmica:</span>
              <span className="font-medium text-blue-600">+{formatPrice(specialFees.thermal)}</span>
            </div>
          )}
          
          {specialFees.urgent > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Taxa urgente:</span>
              <span className="font-medium text-purple-600">+{formatPrice(specialFees.urgent)}</span>
            </div>
          )}
          
          {isPeakHour && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Horário de pico (+10%):</span>
              <span className="font-medium text-yellow-600">+{formatPrice(peakHourFee)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Produtos ({selectedProducts.length}):</span>
            <span className="font-medium text-green-600">{formatPrice(productsPrice)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total da Entrega:</span>
            <span className="text-xl font-bold text-green-600">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        {/* Divisão de receita */}
        <div className="bg-white p-3 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Divisão de Receita</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-green-600">80%</div>
              <div className="text-gray-600">Motoboy</div>
              <div className="text-xs text-gray-500">{formatPrice(totalPrice * 0.80)}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">20%</div>
              <div className="text-gray-600">Plataforma</div>
              <div className="text-xs text-gray-500">{formatPrice(totalPrice * 0.20)}</div>
            </div>
          </div>
        </div>

        {/* Tempo estimado */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Tempo estimado: {distance <= 2 ? '15-20 min' : distance <= 5 ? '20-30 min' : distance <= 8 ? '30-40 min' : '40+ min'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingBreakdown;
