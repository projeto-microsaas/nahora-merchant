import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { MapPin, Plus } from 'lucide-react';
import axios from 'axios';

const AddressFieldsTest = ({ type }) => {
  const { control, setValue, watch } = useFormContext();
  const prefix = type === 'pickup' ? 'pickupAddress' : 'deliveryAddress';
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressMode, setAddressMode] = useState('new');
  
  // Buscar endereços padrão apenas para coleta
  useEffect(() => {
    if (type === 'pickup') {
      fetchAddresses();
    }
  }, [type]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/addresses');
      const pickupAddresses = (response.data.addresses || []).filter(addr => addr.type === 'pickup');
      setAddresses(pickupAddresses);
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (addressId) => {
    const selectedAddress = addresses.find(addr => addr._id === addressId);
    if (selectedAddress) {
      setValue(`${prefix}.type`, 'Rua');
      setValue(`${prefix}.street`, selectedAddress.street);
      setValue(`${prefix}.number`, selectedAddress.number);
      setValue(`${prefix}.neighborhood`, selectedAddress.neighborhood);
    }
  };

  const handleModeChange = (mode) => {
    setAddressMode(mode);
    if (mode === 'new') {
      setValue(`${prefix}.type`, '');
      setValue(`${prefix}.street`, '');
      setValue(`${prefix}.number`, '');
      setValue(`${prefix}.neighborhood`, '');
    }
  };

  return (
    <div>
      
      {/* Seletor de modo apenas para coleta */}
      {type === 'pickup' && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            {addresses.length > 0 && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', backgroundColor: addressMode === 'select' ? '#f3f4f6' : 'white' }}>
                <input
                  type="radio"
                  name={`${prefix}Mode`}
                  value="select"
                  checked={addressMode === 'select'}
                  onChange={(e) => handleModeChange(e.target.value)}
                  style={{ accentColor: '#ff7300' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>📍 Selecionar endereço padrão</span>
              </label>
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', backgroundColor: addressMode === 'new' ? '#f3f4f6' : 'white' }}>
              <input
                type="radio"
                name={`${prefix}Mode`}
                value="new"
                checked={addressMode === 'new'}
                onChange={(e) => handleModeChange(e.target.value)}
                style={{ accentColor: '#ff7300' }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>✏️ Criar novo endereço</span>
            </label>
          </div>
        </div>
      )}

      {/* Seletor de endereço padrão */}
      {type === 'pickup' && addressMode === 'select' && addresses.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Endereço Padrão</Label>
          <Select onValueChange={handleAddressSelect}>
            <SelectTrigger style={{ marginBottom: '0.5rem' }}>
              <SelectValue placeholder="Selecione um endereço" />
            </SelectTrigger>
            <SelectContent>
              {addresses.map((address) => (
                <SelectItem key={address._id} value={address._id}>
                  {address.street}, {address.number} - {address.neighborhood}
                  {address.isDefault && ' (Padrão)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => window.open('/addresses', '_blank')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              fontSize: '0.875rem',
              padding: '0.5rem 1rem'
            }}
          >
            <Plus style={{ width: '14px', height: '14px' }} />
            Gerenciar Endereços
          </Button>
        </div>
      )}

      {/* Campos de endereço manual */}
      {addressMode === 'new' && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Tipo</Label>
              <Select onValueChange={(value) => setValue(`${prefix}.type`, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rua">Rua</SelectItem>
                  <SelectItem value="Avenida">Avenida</SelectItem>
                  <SelectItem value="Praça">Praça</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Logradouro</Label>
              <Input
                placeholder="Nome da rua"
                value={watch(`${prefix}.street`) || ''}
                onChange={(e) => setValue(`${prefix}.street`, e.target.value)}
              />
            </div>
            <div>
              <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Número</Label>
              <Input
                placeholder="123"
                value={watch(`${prefix}.number`) || ''}
                onChange={(e) => setValue(`${prefix}.number`, e.target.value)}
              />
            </div>
            <div>
              <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Bairro</Label>
              <Input
                placeholder="Centro"
                value={watch(`${prefix}.neighborhood`) || ''}
                onChange={(e) => setValue(`${prefix}.neighborhood`, e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Para entrega, sempre mostrar campos manuais */}
      {type === 'delivery' && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Tipo</Label>
              <Select onValueChange={(value) => setValue(`${prefix}.type`, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rua">Rua</SelectItem>
                  <SelectItem value="Avenida">Avenida</SelectItem>
                  <SelectItem value="Praça">Praça</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Logradouro</Label>
              <Input
                placeholder="Nome da rua"
                value={watch(`${prefix}.street`) || ''}
                onChange={(e) => setValue(`${prefix}.street`, e.target.value)}
              />
            </div>
            <div>
              <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Número</Label>
              <Input
                placeholder="123"
                value={watch(`${prefix}.number`) || ''}
                onChange={(e) => setValue(`${prefix}.number`, e.target.value)}
              />
            </div>
            <div>
              <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Bairro</Label>
              <Input
                placeholder="Centro"
                value={watch(`${prefix}.neighborhood`) || ''}
                onChange={(e) => setValue(`${prefix}.neighborhood`, e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressFieldsTest;
