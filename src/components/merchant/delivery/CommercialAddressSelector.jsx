import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Settings } from 'lucide-react';
import axios from '../../../lib/axios';
import styles from './CommercialAddressSelector.module.css';

const CommercialAddressSelector = ({ onSelect, selectedValue = null }) => {
  const [selected, setSelected] = useState(selectedValue);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar endereços do banco de dados
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      console.log('🔍 Buscando endereços para seleção comercial...');
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.log('❌ Token não encontrado');
        return;
      }

      const response = await axios.get('/api/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✅ Endereços carregados:', response.data);
      
      // Filtrar apenas endereços de coleta (pickup)
      const pickupAddresses = response.data.addresses?.filter(addr => addr.type === 'pickup') || [];
      console.log('📍 Endereços de coleta encontrados:', pickupAddresses);
      
      setAddresses(pickupAddresses);
    } catch (error) {
      console.error('❌ Erro ao carregar endereços:', error);
      console.error('📋 Status do erro:', error.response?.status);
      console.error('📄 Dados do erro:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedValue !== null) {
      setSelected(selectedValue);
    }
  }, [selectedValue]);

  const handleSelect = (addressId) => {
    setSelected(addressId);
    onSelect(addressId);
  };

  const formatAddress = (address) => {
    return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city} - ${address.state}`;
  };

  const getAddressName = (address) => {
    // Se o endereço tem um nome personalizado, usar ele, senão usar o tipo
    return address.name || `${address.type === 'pickup' ? 'Coleta' : 'Entrega'} - ${address.neighborhood}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Selecione a Unidade de Coleta</div>
        <Button 
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => window.open('/addresses', '_blank')}
          className={styles.manageButton}
          title="Gerenciar endereços"
        >
          <Settings className={styles.settingsIcon} />
          Gerenciar
        </Button>
      </div>
      <div className={styles.addressGrid}>
        {loading ? (
          <div className={styles.loadingMessage}>Carregando endereços...</div>
        ) : addresses.length === 0 ? (
          <div className={styles.noAddressesMessage}>
            Nenhum endereço de coleta encontrado.
            <br />
            <small>Clique em "Gerenciar" para adicionar endereços.</small>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address._id}
              className={`${styles.addressCard} ${selected === address._id ? styles.selected : ''}`}
              onClick={() => handleSelect(address._id)}
            >
              <input
                type="radio"
                name="commercialAddress"
                value={address._id}
                checked={selected === address._id}
                onChange={() => handleSelect(address._id)}
                className={styles.radioInput}
              />
              <div className={styles.cardContent}>
                <div className={styles.locationName}>
                  {getAddressName(address)}
                  {address.isDefault && <span className={styles.defaultBadge}>Padrão</span>}
                </div>
                <div className={styles.addressText}>
                  {formatAddress(address)}
                </div>
                {address.complement && (
                  <div className={styles.complement}>
                    {address.complement}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommercialAddressSelector;
