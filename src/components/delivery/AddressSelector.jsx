import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Plus, 
  Star, 
  Edit, 
  Trash2, 
  Check,
  Home,
  Building,
  Store
} from 'lucide-react';
import { toast } from 'sonner';
import axios from '@/lib/axios';

const addressIcons = {
  'home': '🏠',
  'work': '🏢',
  'store': '🏪',
  'other': '📍'
};

const AddressSelector = ({ 
  selectedAddress, 
  onAddressSelect, 
  onNewAddress, 
  label = "Endereço de Coleta",
  placeholder = "Digite o endereço de coleta..."
}) => {
  const [favoriteAddresses, setFavoriteAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    address: '',
    type: 'store',
    isDefault: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavoriteAddresses();
  }, []);

  const fetchFavoriteAddresses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavoriteAddresses(response.data);
    } catch (error) {
      console.error('Erro ao buscar endereços favoritos:', error);
      // Endereços de exemplo se a API falhar
      setFavoriteAddresses([
        {
          _id: '1',
          name: 'Loja Principal',
          address: 'Rua das Flores, 123 - Centro',
          type: 'store',
          isDefault: true
        },
        {
          _id: '2',
          name: 'Depósito',
          address: 'Av. Industrial, 456 - Zona Industrial',
          type: 'work',
          isDefault: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.name || !newAddress.address) {
      toast.error('Preencha nome e endereço');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('/api/addresses', newAddress, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFavoriteAddresses([...favoriteAddresses, response.data]);
      setNewAddress({ name: '', address: '', type: 'store', isDefault: false });
      setShowAddForm(false);
      toast.success('Endereço salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      // Adicionar localmente se a API falhar
      const tempAddress = {
        _id: Date.now().toString(),
        ...newAddress
      };
      setFavoriteAddresses([...favoriteAddresses, tempAddress]);
      setNewAddress({ name: '', address: '', type: 'store', isDefault: false });
      setShowAddForm(false);
      toast.success('Endereço salvo localmente!');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`/api/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFavoriteAddresses(favoriteAddresses.filter(addr => addr._id !== addressId));
      toast.success('Endereço removido!');
    } catch (error) {
      console.error('Erro ao remover endereço:', error);
      // Remover localmente se a API falhar
      setFavoriteAddresses(favoriteAddresses.filter(addr => addr._id !== addressId));
      toast.success('Endereço removido localmente!');
    }
  };

  const handleAddressSelect = (address) => {
    onAddressSelect(address.address);
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />;
      case 'work': return <Building className="h-4 w-4" />;
      case 'store': return <Store className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Label className="text-base font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {label}
        </Label>
        <div className="text-center py-4 text-gray-500">
          Carregando endereços...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {label}
        </Label>
        <Button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          {showAddForm ? 'Cancelar' : 'Adicionar'}
        </Button>
      </div>

      {/* Formulário para adicionar endereço */}
      {showAddForm && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Endereço Favorito
            </h4>
            <div className="space-y-3">
              <div>
                <Label>Nome do Local</Label>
                <Input
                  placeholder="Ex: Loja Principal, Depósito, Casa..."
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Endereço Completo</Label>
                <Input
                  placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo - SP"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                />
              </div>
              <div>
                <Label>Tipo de Local</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                >
                  <option value="store">🏪 Loja/Comércio</option>
                  <option value="work">🏢 Trabalho/Escritório</option>
                  <option value="home">🏠 Casa/Residência</option>
                  <option value="other">📍 Outro</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                />
                <Label htmlFor="isDefault" className="text-sm">
                  Definir como endereço padrão
                </Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddAddress} size="sm">
                  <Check className="h-4 w-4 mr-1" />
                  Salvar
                </Button>
                <Button 
                  onClick={() => setShowAddForm(false)} 
                  variant="outline" 
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Endereços favoritos */}
      {favoriteAddresses.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Endereços Favoritos
          </h5>
          <div className="grid grid-cols-1 gap-2">
            {favoriteAddresses.map((address) => (
              <Card
                key={address._id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedAddress === address.address 
                    ? 'ring-2 ring-orange-500 bg-orange-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleAddressSelect(address)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-lg">
                        {addressIcons[address.type] || '📍'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h6 className="font-semibold text-sm">{address.name}</h6>
                          {address.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              Padrão
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{address.address}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {getAddressIcon(address.type)}
                          <span className="text-xs text-gray-500 capitalize">
                            {address.type === 'store' ? 'Loja' : 
                             address.type === 'work' ? 'Trabalho' :
                             address.type === 'home' ? 'Casa' : 'Outro'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {selectedAddress === address.address && (
                        <Badge className="bg-orange-500 text-white text-xs">
                          Selecionado
                        </Badge>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address._id);
                        }}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Campo para endereço manual */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700">
          Ou digite um endereço novo:
        </h5>
        <Input
          placeholder={placeholder}
          value={selectedAddress}
          onChange={(e) => onAddressSelect(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AddressSelector;
