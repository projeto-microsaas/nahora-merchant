import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Star } from 'lucide-react';

const AddressForm = ({ 
  pickupAddress, 
  deliveryAddress, 
  onPickupChange, 
  onDeliveryChange,
  favoriteAddresses = [],
  onAddFavorite 
}) => {
  const [showPickupFavorites, setShowPickupFavorites] = useState(false);
  const [showDeliveryFavorites, setShowDeliveryFavorites] = useState(false);

  const handlePickupSelect = (address) => {
    onPickupChange(address);
    setShowPickupFavorites(false);
  };

  const handleDeliverySelect = (address) => {
    onDeliveryChange(address);
    setShowDeliveryFavorites(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">📍 Endereços</h3>
      
      {/* Endereço de Coleta */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <Label className="text-base font-medium">Coleta</Label>
              {favoriteAddresses.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPickupFavorites(!showPickupFavorites)}
                >
                  <Star className="h-4 w-4 mr-1" />
                  Favoritos
                </Button>
              )}
            </div>
            
            {showPickupFavorites && (
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <p className="text-sm font-medium">Endereços favoritos:</p>
                {favoriteAddresses.map((addr, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded border cursor-pointer hover:bg-gray-50"
                    onClick={() => handlePickupSelect(addr)}
                  >
                    <div>
                      <p className="font-medium">{addr.name}</p>
                      <p className="text-sm text-gray-600">{addr.address}</p>
                    </div>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                ))}
              </div>
            )}
            
            <Input
              placeholder="Endereço do comerciante (ex: Rua das Flores, 123 - Centro)"
              value={pickupAddress}
              onChange={(e) => onPickupChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Endereço de Entrega */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <Label className="text-base font-medium">Entrega</Label>
              {favoriteAddresses.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeliveryFavorites(!showDeliveryFavorites)}
                >
                  <Star className="h-4 w-4 mr-1" />
                  Favoritos
                </Button>
              )}
            </div>
            
            {showDeliveryFavorites && (
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <p className="text-sm font-medium">Endereços favoritos:</p>
                {favoriteAddresses.map((addr, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded border cursor-pointer hover:bg-gray-50"
                    onClick={() => handleDeliverySelect(addr)}
                  >
                    <div>
                      <p className="font-medium">{addr.name}</p>
                      <p className="text-sm text-gray-600">{addr.address}</p>
                    </div>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                ))}
              </div>
            )}
            
            <Input
              placeholder="Endereço do cliente (ex: Av. Paulista, 456 - Bela Vista)"
              value={deliveryAddress}
              onChange={(e) => onDeliveryChange(e.target.value)}
            />
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>💡</span>
              <span>Cole o endereço do WhatsApp ou digite manualmente</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressForm;
