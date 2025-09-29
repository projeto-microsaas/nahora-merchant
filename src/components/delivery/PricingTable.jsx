import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, MapPin, Package, Clock, Truck } from 'lucide-react';

const PricingTable = () => {
  const pricingStructure = {
    base: {
      price: 6.00,
      description: 'Taxa base (até 2km)',
      icon: '🏠'
    },
    perKm: {
      price: 1.50,
      description: 'Por km adicional',
      icon: '📏'
    },
    special: {
      price: 2.00,
      description: 'Taxa especial (frágil/térmico)',
      icon: '⚠️'
    }
  };

  const distanceRanges = [
    { range: 'Até 2km', price: 6.00, description: 'Taxa base' },
    { range: '2-5km', price: 8.00, description: 'Base + 2km extras' },
    { range: '5-8km', price: 10.00, description: 'Base + 5km extras' },
    { range: '8-12km', price: 13.00, description: 'Base + 8km extras' },
    { range: '12km+', price: 15.00, description: 'Base + 10km+ extras' }
  ];

  const packageTypes = [
    { type: 'Envelope', weight: 'Até 1kg', multiplier: 1.0, icon: '📄' },
    { type: 'Pequeno', weight: 'Até 2kg', multiplier: 1.0, icon: '📦' },
    { type: 'Médio', weight: 'Até 5kg', multiplier: 1.05, icon: '📦' },
    { type: 'Grande', weight: 'Até 10kg', multiplier: 1.10, icon: '📦' },
    { type: 'Especial', weight: 'Variável', multiplier: 1.15, icon: '⚠️' }
  ];

  const additionalFees = [
    { fee: 'Horário de Pico', price: '+10%', description: '18h-20h', icon: '⏰' },
    { fee: 'Entrega Urgente', price: '+R$ 2,00', description: 'Menos de 30min', icon: '⚡' },
    { fee: 'Item Frágil', price: '+R$ 2,00', description: 'Cuidado especial', icon: '🔒' },
    { fee: 'Baú Térmico', price: '+R$ 2,00', description: 'Mantém temperatura', icon: '❄️' }
  ];

  return (
    <div className="space-y-6">
      {/* Estrutura de Preços */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Estrutura de Preços
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">{pricingStructure.base.icon}</div>
              <div className="text-2xl font-bold text-blue-600">
                R$ {pricingStructure.base.price.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">
                {pricingStructure.base.description}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">{pricingStructure.perKm.icon}</div>
              <div className="text-2xl font-bold text-green-600">
                R$ {pricingStructure.perKm.price.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">
                {pricingStructure.perKm.description}
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl mb-2">{pricingStructure.special.icon}</div>
              <div className="text-2xl font-bold text-orange-600">
                R$ {pricingStructure.special.price.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">
                {pricingStructure.special.description}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Distâncias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Preços por Distância
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Distância</th>
                  <th className="text-left py-3 px-4">Preço</th>
                  <th className="text-left py-3 px-4">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {distanceRanges.map((range, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{range.range}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800">
                        R$ {range.price.toFixed(2)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{range.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tipos de Pacote */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Multiplicadores por Tipo de Pacote
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packageTypes.map((pkg, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{pkg.icon}</span>
                  <div>
                    <h4 className="font-semibold">{pkg.type}</h4>
                    <p className="text-sm text-gray-600">{pkg.weight}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={pkg.multiplier > 1.0 ? "default" : "outline"}
                    className={pkg.multiplier > 1.0 ? "bg-orange-100 text-orange-800" : ""}
                  >
                    {pkg.multiplier === 1.0 ? 'Preço base' : `+${((pkg.multiplier - 1) * 100).toFixed(0)}%`}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Taxas Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Taxas Adicionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalFees.map((fee, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{fee.icon}</span>
                  <div>
                    <h4 className="font-medium">{fee.fee}</h4>
                    <p className="text-sm text-gray-600">{fee.description}</p>
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-800">
                  {fee.price}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Divisão de Receita */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Divisão de Receita
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">80%</div>
              <div className="text-lg font-semibold">Motoboy</div>
              <div className="text-sm text-gray-600">Recebe a maior parte da corrida</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">20%</div>
              <div className="text-lg font-semibold">Plataforma</div>
              <div className="text-sm text-gray-600">Cobre operação e desenvolvimento</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Exemplo:</strong> Uma entrega de R$ 10,00 → Motoboy recebe R$ 8,00 e Plataforma fica com R$ 2,00
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingTable;
