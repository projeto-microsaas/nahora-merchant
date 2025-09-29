import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const packageTypes = [
  {
    id: 'envelope',
    name: 'Envelope',
    description: 'Documentos, cartas, pequenos itens',
    weight: 'até 1kg',
    basePrice: 5.00,
    icon: '📄',
    transport: 'Bolsa lateral'
  },
  {
    id: 'small',
    name: 'Pequeno',
    description: 'Comida individual, medicamentos',
    weight: '1-3kg',
    basePrice: 6.00,
    icon: '📦',
    transport: 'Bolsa lateral ou baú pequeno'
  },
  {
    id: 'medium',
    name: 'Médio',
    description: 'Comida para família, pequenas compras',
    weight: '3-8kg',
    basePrice: 8.00,
    icon: '📦',
    transport: 'Baú médio'
  },
  {
    id: 'large',
    name: 'Grande',
    description: 'Compras grandes, ferramentas',
    weight: '8-15kg',
    basePrice: 12.00,
    icon: '📦',
    transport: 'Baú grande'
  },
  {
    id: 'special',
    name: 'Especial',
    description: 'Frágil, térmico, urgente',
    weight: 'varia',
    basePrice: 0.00, // Será adicionado ao tipo base
    icon: '⚠️',
    transport: 'Baú especializado',
    isSpecial: true
  }
];

const PackageTypeSelector = ({ selectedPackage, onPackageSelect, specialOptions = {} }) => {
  const { isFragile = false, isThermal = false, isUrgent = false } = specialOptions;
  
  const calculateSpecialPrice = () => {
    let extraPrice = 0;
    if (isFragile) extraPrice += 2.00;
    if (isThermal) extraPrice += 2.00;
    if (isUrgent) extraPrice += 3.00;
    return extraPrice;
  };

  const getTotalPrice = (packageType) => {
    if (packageType.isSpecial) {
      return calculateSpecialPrice();
    }
    return packageType.basePrice + calculateSpecialPrice();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">📦 Tipo de Pacote</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packageTypes.map((pkg) => (
          <Card 
            key={pkg.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedPackage?.id === pkg.id 
                ? 'ring-2 ring-orange-500 bg-orange-50' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onPackageSelect(pkg)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{pkg.icon}</span>
                    <h4 className="font-semibold">{pkg.name}</h4>
                    <Badge variant="outline">{pkg.weight}</Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {pkg.description}
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    🚚 {pkg.transport}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600">
                    R$ {getTotalPrice(pkg).toFixed(2)}
                  </div>
                  {pkg.isSpecial && (
                    <div className="text-xs text-gray-500">
                      + tipo base
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Opções Especiais */}
      {selectedPackage?.isSpecial && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">⚠️ Opções Especiais</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={isFragile}
                  onChange={(e) => onPackageSelect(selectedPackage, { ...specialOptions, isFragile: e.target.checked })}
                />
                <span>Frágil (+R$ 2,00)</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={isThermal}
                  onChange={(e) => onPackageSelect(selectedPackage, { ...specialOptions, isThermal: e.target.checked })}
                />
                <span>Térmico (+R$ 2,00)</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={isUrgent}
                  onChange={(e) => onPackageSelect(selectedPackage, { ...specialOptions, isUrgent: e.target.checked })}
                />
                <span>Urgente (+R$ 3,00)</span>
              </label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PackageTypeSelector;
