import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";
import { MapPin, Plus } from 'lucide-react';
import axios from '../../../lib/axios';
import styles from './AddressFields.module.css';

const AddressFields = ({ type }) => {
  const { control, setValue, watch } = useFormContext();
  const prefix = type === 'pickup' ? 'pickupAddress' : 'deliveryAddress';
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressMode, setAddressMode] = useState('select'); // 'select' ou 'new'
  
  // Buscar endereços padrão apenas para coleta
  useEffect(() => {
    if (type === 'pickup') {
      fetchAddresses();
    }
  }, [type]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      console.log('🔍 Buscando endereços...');
      
      // Verificar token
      const token = localStorage.getItem('authToken');
      console.log('🔑 Token encontrado:', token ? 'Sim' : 'Não');
      console.log('🔑 Token (primeiros 20 chars):', token ? token.substring(0, 20) + '...' : 'Nenhum');
      
      const response = await axios.get('/api/addresses');
      console.log('📦 Resposta da API:', response.data);
      console.log('📦 Status da resposta:', response.status);
      console.log('📦 Headers da resposta:', response.headers);
      const pickupAddresses = (response.data.addresses || []).filter(addr => addr.type === 'pickup');
      console.log('🏪 Endereços de coleta:', pickupAddresses);
      console.log('🏪 Quantidade de endereços de coleta:', pickupAddresses.length);
      setAddresses(pickupAddresses);
    } catch (error) {
      console.error('❌ Erro ao buscar endereços:', error);
      console.error('❌ Status do erro:', error.response?.status);
      console.error('❌ Dados do erro:', error.response?.data);
      console.error('❌ Headers da requisição:', error.config?.headers);
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

  // Para entrega, sempre mostrar campos manuais
  if (type === 'delivery') {
    return (
      <div className={styles.container}>
        <div className={styles.labelContainer}>
          <MapPin className={styles.icon} />
          <span>Endereço de Entrega</span>
        </div>
        
        <div className={styles.inputGroup}>
          <FormField
            control={control}
            name={`${prefix}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={styles.select}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className={styles.dropdown}>
                    <SelectItem value="Rua">Rua</SelectItem>
                    <SelectItem value="Avenida">Avenida</SelectItem>
                    <SelectItem value="Praça">Praça</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${prefix}.street`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logradouro</FormLabel>
                <FormControl>
                  <Input {...field} className={styles.input} placeholder="Logradouro" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${prefix}.number`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input {...field} className={styles.input} placeholder="Número" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${prefix}.neighborhood`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input {...field} className={styles.input} placeholder="Bairro" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${prefix}.residenceType`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Residência</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={styles.select}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className={styles.dropdown}>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Apartamento">Apartamento</SelectItem>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }

  // Para coleta, mostrar seletor ou campos manuais
  return (
    <div className={styles.container}>
      <div style={{background: 'red', color: 'white', padding: '5px', margin: '5px 0'}}>
        🚨 DEBUG: Componente AddressFields renderizado para PICKUP - Endereços: {addresses.length}
      </div>
      <div className={styles.labelContainer}>
        <MapPin className={styles.icon} />
        <span>Coleta</span>
      </div>
      
           {/* Seletor de modo apenas para coleta */}
           <div className={styles.modeSelector}>
             <div className={styles.radioGroup}>
               {addresses.length > 0 && (
                 <label className={styles.radioOption}>
                   <input
                     type="radio"
                     name={`${prefix}Mode`}
                     value="select"
                     checked={addressMode === 'select'}
                     onChange={(e) => handleModeChange(e.target.value)}
                   />
                   <span>📍 Usar endereço padrão</span>
                 </label>
               )}
               <label className={styles.radioOption}>
                 <input
                   type="radio"
                   name={`${prefix}Mode`}
                   value="new"
                   checked={addressMode === 'new'}
                   onChange={(e) => handleModeChange(e.target.value)}
                 />
                 <span>✏️ Criar novo endereço</span>
               </label>
             </div>
           </div>

           {/* Seletor de endereço padrão */}
           {console.log('🔍 Debug renderização:', { addressMode, addressesLength: addresses.length, type })}
           {addressMode === 'select' && addresses.length > 0 && (
             <div className={styles.addressSelector}>
               <div style={{background: 'yellow', padding: '10px', margin: '10px 0'}}>
                 🚨 DEBUG: Endereços encontrados: {addresses.length}
               </div>
               <FormLabel>Unidades de Coleta</FormLabel>
               <div className={styles.addressRadioGroup}>
                 {addresses.map((address) => (
                   <label key={address._id} className={styles.addressRadioOption}>
                     <input
                       type="radio"
                       name={`${prefix}Address`}
                       value={address._id}
                       onChange={(e) => {
                         if (e.target.checked) {
                           handleAddressSelect(address._id);
                         }
                       }}
                       className={styles.radioInput}
                     />
                     <div className={styles.radioContent}>
                       <div className={styles.addressText}>
                         {address.street}, {address.number} - {address.neighborhood}
                         {address.isDefault && <span className={styles.defaultBadge}>Padrão</span>}
                       </div>
                     </div>
                   </label>
                 ))}
               </div>
               <Button 
                 type="button" 
                 variant="outline" 
                 size="sm"
                 onClick={() => window.open('/addresses', '_blank')}
                 className={styles.manageButton}
               >
                 <Plus className={styles.buttonIcon} />
                 Gerenciar Endereços
               </Button>
             </div>
           )}

      {/* Campos de endereço manual */}
      {addressMode === 'new' && (
        <div className={styles.inputGroup}>
          <FormField
            control={control}
            name={`${prefix}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={styles.select}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className={styles.dropdown}>
                    <SelectItem value="Rua">Rua</SelectItem>
                    <SelectItem value="Avenida">Avenida</SelectItem>
                    <SelectItem value="Praça">Praça</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${prefix}.street`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logradouro</FormLabel>
                <FormControl>
                  <Input {...field} className={styles.input} placeholder="Logradouro" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${prefix}.number`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input {...field} className={styles.input} placeholder="Número" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${prefix}.neighborhood`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input {...field} className={styles.input} placeholder="Bairro" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${prefix}.residenceType`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Residência</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={styles.select}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className={styles.dropdown}>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Apartamento">Apartamento</SelectItem>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default AddressFields;