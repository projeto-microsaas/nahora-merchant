import React, { useState } from 'react';
import CommercialAddressSelector from './CommercialAddressSelector';

const CommercialAddressSelectorExample = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
    console.log('Endereço selecionado:', addressId);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Exemplo de Uso - Seletor de Endereços Comerciais</h2>
      
      <CommercialAddressSelector 
        onSelect={handleAddressSelect}
        selectedValue={selectedAddress}
      />
      
      {selectedAddress && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '0.5rem',
          border: '1px solid #d1d5db'
        }}>
          <strong>Endereço selecionado:</strong> {selectedAddress}
        </div>
      )}
      
      <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
        <h3>Como usar:</h3>
        <pre style={{ 
          backgroundColor: '#f9fafb', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          overflow: 'auto'
        }}>
{`import CommercialAddressSelector from './CommercialAddressSelector';

const MyComponent = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
    // addressId será 'matriz' ou 'filial'
  };

  return (
    <CommercialAddressSelector 
      onSelect={handleAddressSelect}
      selectedValue={selectedAddress}
    />
  );
};`}
        </pre>
      </div>
    </div>
  );
};

export default CommercialAddressSelectorExample;
