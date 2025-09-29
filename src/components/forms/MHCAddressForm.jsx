import React, { useState, useEffect } from 'react';
import { MapPin, User, AlertCircle, CheckCircle, Star, Plus, Home, Building } from 'lucide-react';
import styles from '../../pages/deliveries/NewDeliveryPage.module.css';

const MHCAddressForm = ({ onSubmit, initialData = {}, isLoading = false }) => {
  const [formData, setFormData] = useState({
    // Endereço de Coleta
    pickupAddressType: 'Rua',
    pickupStreet: '',
    pickupNumber: '',
    pickupNeighborhood: '',
    pickupCity: '',
    
    // Endereço de Entrega
    deliveryAddressType: 'Rua',
    deliveryStreet: '',
    deliveryNumber: '',
    deliveryNeighborhood: '',
    deliveryCity: '',
    
    // Dados do Cliente
    customerName: '',
    customerPhone: '',
    instructions: '',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [activeAddressType, setActiveAddressType] = useState('pickup'); // 'pickup' ou 'delivery'
  const [favoriteAddresses, setFavoriteAddresses] = useState([]);
  const [showAddFavorite, setShowAddFavorite] = useState(false);
  const [newFavoriteName, setNewFavoriteName] = useState('');

  const addressTypes = ['Rua', 'Avenida', 'Praça'];

  // Carregar endereços favoritos do localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteAddresses');
    if (savedFavorites) {
      setFavoriteAddresses(JSON.parse(savedFavorites));
    }
  }, []);

  // Salvar endereços favoritos no localStorage
  const saveFavoriteAddresses = (addresses) => {
    localStorage.setItem('favoriteAddresses', JSON.stringify(addresses));
    setFavoriteAddresses(addresses);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    // Validação para campos de endereço (pickup e delivery)
    if (name.includes('Street')) {
      if (!value.trim()) {
        newErrors[name] = 'Endereço é obrigatório';
      } else if (value.trim().length < 3) {
        newErrors[name] = 'Endereço deve ter pelo menos 3 caracteres';
      } else {
        delete newErrors[name];
      }
    } else if (name.includes('Number')) {
      if (!value.trim()) {
        newErrors[name] = 'Número é obrigatório';
      } else {
        delete newErrors[name];
      }
    } else if (name.includes('Neighborhood')) {
      if (!value.trim()) {
        newErrors[name] = 'Bairro é obrigatório';
      } else if (value.trim().length < 2) {
        newErrors[name] = 'Bairro deve ter pelo menos 2 caracteres';
      } else {
        delete newErrors[name];
      }
    } else if (name.includes('City')) {
      if (!value.trim()) {
        newErrors[name] = 'Cidade é obrigatória';
      } else if (value.trim().length < 2) {
        newErrors[name] = 'Cidade deve ter pelo menos 2 caracteres';
      } else {
        delete newErrors[name];
      }
    } else if (name === 'customerName') {
      if (!value.trim()) {
        newErrors.customerName = 'Nome do cliente é obrigatório';
      } else if (value.trim().length < 2) {
        newErrors.customerName = 'Nome deve ter pelo menos 2 caracteres';
      } else {
        delete newErrors.customerName;
      }
    } else if (name === 'customerPhone') {
      if (!value.trim()) {
        newErrors.customerPhone = 'Telefone é obrigatório';
      } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value) && !/^\d{10,11}$/.test(value)) {
        newErrors.customerPhone = 'Telefone deve ter formato válido';
      } else {
        delete newErrors.customerPhone;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const selectFavoriteAddress = (favorite) => {
    const prefix = activeAddressType === 'pickup' ? 'pickup' : 'delivery';
    
    setFormData(prev => ({
      ...prev,
      [`${prefix}AddressType`]: favorite.type,
      [`${prefix}Street`]: favorite.street,
      [`${prefix}Number`]: favorite.number,
      [`${prefix}Neighborhood`]: favorite.neighborhood,
      [`${prefix}City`]: favorite.city
    }));
  };

  const addToFavorites = () => {
    if (!newFavoriteName.trim()) return;
    
    const prefix = activeAddressType === 'pickup' ? 'pickup' : 'delivery';
    const currentAddress = {
      id: Date.now().toString(),
      name: newFavoriteName.trim(),
      type: formData[`${prefix}AddressType`],
      street: formData[`${prefix}Street`],
      number: formData[`${prefix}Number`],
      neighborhood: formData[`${prefix}Neighborhood`],
      city: formData[`${prefix}City`]
    };
    
    const updatedFavorites = [...favoriteAddresses, currentAddress];
    saveFavoriteAddresses(updatedFavorites);
    setNewFavoriteName('');
    setShowAddFavorite(false);
  };

  const removeFavorite = (favoriteId) => {
    const updatedFavorites = favoriteAddresses.filter(fav => fav.id !== favoriteId);
    saveFavoriteAddresses(updatedFavorites);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validação em tempo real
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Marcar todos os campos como tocados
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validar todos os campos obrigatórios
    const requiredFields = [
      'pickupStreet', 'pickupNumber', 'pickupNeighborhood', 'pickupCity',
      'deliveryStreet', 'deliveryNumber', 'deliveryNeighborhood', 'deliveryCity',
      'customerName', 'customerPhone'
    ];
    
    const isValid = requiredFields.every(field => {
      return validateField(field, formData[field]);
    });

    if (isValid && onSubmit) {
      // Transformar dados para o formato esperado
      const formattedData = {
        pickupAddress: {
          type: formData.pickupAddressType,
          street: formData.pickupStreet,
          number: formData.pickupNumber,
          neighborhood: formData.pickupNeighborhood,
          city: formData.pickupCity
        },
        deliveryAddress: {
          type: formData.deliveryAddressType,
          street: formData.deliveryStreet,
          number: formData.deliveryNumber,
          neighborhood: formData.deliveryNeighborhood,
          city: formData.deliveryCity
        },
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        instructions: formData.instructions
      };
      
      onSubmit(formattedData);
    }
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    handleInputChange({
      target: {
        name: e.target.name,
        value: formatted
      }
    });
  };

  const getFieldClassName = (fieldName) => {
    let baseClass;
    
    if (fieldName.includes('Street') || fieldName.includes('Number') || fieldName.includes('Neighborhood') || fieldName.includes('City')) {
      baseClass = styles.addressInput;
    } else if (fieldName.includes('AddressType')) {
      baseClass = styles.addressSelect;
    } else if (fieldName === 'instructions') {
      baseClass = styles.instructionsTextarea;
    } else {
      baseClass = styles.clientInput;
    }
    
    if (touched[fieldName] && errors[fieldName]) {
      return `${baseClass} ${styles.fieldError}`;
    }
    
    return baseClass;
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    formData.pickupStreet && formData.pickupNumber && formData.pickupNeighborhood && formData.pickupCity &&
    formData.deliveryStreet && formData.deliveryNumber && formData.deliveryNeighborhood && formData.deliveryCity &&
    formData.customerName && formData.customerPhone;

  const renderAddressForm = (type) => {
    const prefix = type === 'pickup' ? 'pickup' : 'delivery';
    const isActive = activeAddressType === type;
    
    return (
      <div className={styles.addressSection}>
        <h3 className={styles.addressTitle}>
          <MapPin size={16} />
          {type === 'pickup' ? 'Endereço de Coleta' : 'Endereço de Entrega'}
        </h3>
        
        {/* Seletor de Tipo de Endereço */}
        <div className={styles.addressTypeSelector}>
          <button
            type="button"
            className={`${styles.addressTypeButton} ${activeAddressType === 'pickup' ? styles.active : ''}`}
            onClick={() => setActiveAddressType('pickup')}
          >
            <Home size={16} />
            Coleta
          </button>
          <button
            type="button"
            className={`${styles.addressTypeButton} ${activeAddressType === 'delivery' ? styles.active : ''}`}
            onClick={() => setActiveAddressType('delivery')}
          >
            <Building size={16} />
            Entrega
          </button>
        </div>

        {/* Endereços Favoritos */}
        {favoriteAddresses.length > 0 && (
          <div className={styles.favoriteAddresses}>
            <div className={styles.favoriteAddressesTitle}>
              Endereços Favoritos
            </div>
            <div className={styles.favoriteAddressesList}>
              {favoriteAddresses.map((favorite) => (
                <div
                  key={favorite.id}
                  className={styles.favoriteAddressCard}
                  onClick={() => selectFavoriteAddress(favorite)}
                >
                  <div>
                    <div className={styles.favoriteAddressName}>{favorite.name}</div>
                    <div className={styles.favoriteAddressDetails}>
                      {favorite.type} {favorite.street}, {favorite.number}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(favorite.id);
                    }}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className={styles.addFavoriteButton}
                onClick={() => setShowAddFavorite(!showAddFavorite)}
              >
                <Plus size={12} />
                Adicionar
              </button>
            </div>
          </div>
        )}

        {/* Formulário para Adicionar Favorito */}
        {showAddFavorite && (
          <div className={styles.favoriteForm}>
            <div className={styles.favoriteFormTitle}>
              Adicionar aos Favoritos
            </div>
            <input
              type="text"
              placeholder="Nome do endereço (ex: Casa, Trabalho)"
              value={newFavoriteName}
              onChange={(e) => setNewFavoriteName(e.target.value)}
              className={styles.addressInput}
            />
            <div className={styles.favoriteFormButtons}>
              <button
                type="button"
                className={`${styles.favoriteFormButton} ${styles.primary}`}
                onClick={addToFavorites}
                disabled={!newFavoriteName.trim()}
              >
                Salvar
              </button>
              <button
                type="button"
                className={`${styles.favoriteFormButton} ${styles.secondary}`}
                onClick={() => {
                  setShowAddFavorite(false);
                  setNewFavoriteName('');
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
        
        <div className={styles.addressGrid}>
          {/* Tipo */}
          <div className={styles.addressField}>
            <label className={styles.addressLabel}>Tipo</label>
            <select
              name={`${prefix}AddressType`}
              value={formData[`${prefix}AddressType`]}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={getFieldClassName(`${prefix}AddressType`)}
            >
              {addressTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Endereço */}
          <div className={styles.addressField}>
            <label className={styles.addressLabel}>Endereço</label>
            <input
              type="text"
              name={`${prefix}Street`}
              value={formData[`${prefix}Street`]}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Nome da rua"
              className={getFieldClassName(`${prefix}Street`)}
            />
            {touched[`${prefix}Street`] && errors[`${prefix}Street`] && (
              <div className={styles.errorMessage}>
                <AlertCircle size={12} />
                {errors[`${prefix}Street`]}
              </div>
            )}
            {touched[`${prefix}Street`] && !errors[`${prefix}Street`] && formData[`${prefix}Street`] && (
              <div className={styles.successMessage}>
                <CheckCircle size={12} />
                Endereço válido
              </div>
            )}
          </div>

          {/* Número */}
          <div className={styles.addressField}>
            <label className={styles.addressLabel}>Número</label>
            <input
              type="text"
              name={`${prefix}Number`}
              value={formData[`${prefix}Number`]}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="123"
              className={getFieldClassName(`${prefix}Number`)}
            />
            {touched[`${prefix}Number`] && errors[`${prefix}Number`] && (
              <div className={styles.errorMessage}>
                <AlertCircle size={12} />
                {errors[`${prefix}Number`]}
              </div>
            )}
            {touched[`${prefix}Number`] && !errors[`${prefix}Number`] && formData[`${prefix}Number`] && (
              <div className={styles.successMessage}>
                <CheckCircle size={12} />
                Número válido
              </div>
            )}
          </div>

          {/* Bairro */}
          <div className={styles.addressField}>
            <label className={styles.addressLabel}>Bairro</label>
            <input
              type="text"
              name={`${prefix}Neighborhood`}
              value={formData[`${prefix}Neighborhood`]}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Centro"
              className={getFieldClassName(`${prefix}Neighborhood`)}
            />
            {touched[`${prefix}Neighborhood`] && errors[`${prefix}Neighborhood`] && (
              <div className={styles.errorMessage}>
                <AlertCircle size={12} />
                {errors[`${prefix}Neighborhood`]}
              </div>
            )}
            {touched[`${prefix}Neighborhood`] && !errors[`${prefix}Neighborhood`] && formData[`${prefix}Neighborhood`] && (
              <div className={styles.successMessage}>
                <CheckCircle size={12} />
                Bairro válido
              </div>
            )}
          </div>

          {/* Cidade */}
          <div className={styles.addressField}>
            <label className={styles.addressLabel}>Cidade</label>
            <input
              type="text"
              name={`${prefix}City`}
              value={formData[`${prefix}City`]}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="São Paulo"
              className={getFieldClassName(`${prefix}City`)}
            />
            {touched[`${prefix}City`] && errors[`${prefix}City`] && (
              <div className={styles.errorMessage}>
                <AlertCircle size={12} />
                {errors[`${prefix}City`]}
              </div>
            )}
            {touched[`${prefix}City`] && !errors[`${prefix}City`] && formData[`${prefix}City`] && (
              <div className={styles.successMessage}>
                <CheckCircle size={12} />
                Cidade válida
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {/* Endereço de Coleta */}
      {renderAddressForm('pickup')}
      
      {/* Endereço de Entrega */}
      {renderAddressForm('delivery')}

      {/* Seção de Dados do Cliente */}
      <div className={styles.clientSection}>
        <h3 className={styles.clientTitle}>
          <User size={16} />
          Dados do Cliente
        </h3>
        
        <div className={styles.clientGrid}>
          {/* Nome */}
          <div className={styles.clientField}>
            <label className={styles.clientLabel}>Nome do Cliente</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Ex: João Silva"
              className={getFieldClassName('customerName')}
            />
            {touched.customerName && errors.customerName && (
              <div className={styles.errorMessage}>
                <AlertCircle size={12} />
                {errors.customerName}
              </div>
            )}
            {touched.customerName && !errors.customerName && formData.customerName && (
              <div className={styles.successMessage}>
                <CheckCircle size={12} />
                Nome válido
              </div>
            )}
          </div>

          {/* Telefone */}
          <div className={styles.clientField}>
            <label className={styles.clientLabel}>Telefone</label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handlePhoneChange}
              onBlur={handleBlur}
              placeholder="(11) 99999-9999"
              className={getFieldClassName('customerPhone')}
            />
            {touched.customerPhone && errors.customerPhone && (
              <div className={styles.errorMessage}>
                <AlertCircle size={12} />
                {errors.customerPhone}
              </div>
            )}
            {touched.customerPhone && !errors.customerPhone && formData.customerPhone && (
              <div className={styles.successMessage}>
                <CheckCircle size={12} />
                Telefone válido
              </div>
            )}
          </div>
        </div>

        {/* Instruções */}
        <div className={styles.instructionsField}>
          <label className={styles.instructionsLabel}>Instruções Especiais (Opcional)</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Ex: Entregar na portaria, não tocar a campainha, deixar com o porteiro..."
            className={getFieldClassName('instructions')}
            rows={4}
          />
        </div>
      </div>

      {/* Botão de Submit */}
      <button
        type="submit"
        className={styles.submitButton}
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <>
            <div className={styles.loadingSpinner}></div>
            Processando...
          </>
        ) : (
          <>
            <MapPin size={16} />
            Confirmar Endereço
          </>
        )}
      </button>
    </form>
  );
};

export default MHCAddressForm;
