// src/components/merchant/delivery/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Search, ShoppingCart } from 'lucide-react';
import CartItemCard from './CartItemCard';
import axios from 'axios';
import socket from '../../../lib/socket'; // Corrigir importação
import styles from './ProductList.module.css';

const ProductList = () => {
  const { setValue, watch } = useFormContext();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const selectedProducts = watch('order.products') || [];

  useEffect(() => {
    socket.connect();
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        console.log('Token recuperado do localStorage:', token);
        if (!token) {
          throw new Error('Token de autenticação não encontrado. Faça login novamente.');
        }
        const response = await axios.get('/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Resposta da API:', response.data);
        setProducts(Array.isArray(response.data) ? response.data : response.data.products || []);
      } catch (error) {
        console.error('Erro ao buscar produtos:', {
          message: error.message,
          response: error.response ? error.response.data : null,
          status: error.response ? error.response.status : null,
        });
        setError(`Erro ao carregar produtos: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    return () => socket.disconnect();
  }, []);

  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = (product) => {
    console.log('Adicionando produto:', product);
    const updatedProducts = [...selectedProducts, { ...product, quantity: 1 }];
    setValue('order.products', updatedProducts);
    console.log('Produtos selecionados após adicionar:', updatedProducts);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Tem certeza que deseja remover este produto? Esta ação não pode ser desfeita.')) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Remover produto da lista local
        setProducts(products.filter(p => p._id !== productId));
        
        // Remover produto dos selecionados se estiver lá
        const updatedSelected = selectedProducts.filter(p => p._id !== productId);
        setValue('order.products', updatedSelected, { shouldValidate: true, shouldDirty: true });
        
        console.log('Produto removido com sucesso');
      } catch (error) {
        console.error('Erro ao remover produto:', error);
        alert('Erro ao remover produto. Tente novamente.');
      }
    }
  };

  if (loading) return <div>Carregando produtos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <div 
        className={styles.searchContainer}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '1rem',
          border: '1px solid #e9ecef'
        }}
      >
        <div 
          className={styles.searchWrapper}
          style={{
            position: 'relative',
            flex: 1,
            maxWidth: '400px'
          }}
        >
          <Search 
            className={styles.searchIcon}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              width: '1rem',
              height: '1rem'
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produtos..."
            className={styles.searchInput}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              backgroundColor: '#f1f3f4',
              border: '2px solid #e5e7eb',
              borderRadius: '1rem',
              color: '#374151',
              fontSize: '0.875rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#ff7300';
              e.target.style.backgroundColor = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.backgroundColor = '#f1f3f4';
            }}
          />
        </div>
        <button
          type="button"
          className={styles.cartButton}
          title="Adicionar produto ao carrinho"
          style={{
            padding: '0.75rem',
            backgroundColor: '#ff7300',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(255, 115, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '3rem',
            height: '3rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e56a00';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(255, 115, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ff7300';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(255, 115, 0, 0.3)';
          }}
        >
          <ShoppingCart 
            className={styles.cartIcon}
            style={{
              width: '1.25rem',
              height: '1.25rem'
            }}
          />
        </button>
      </div>
      {filteredProducts.length > 0 ? (
        <div className={styles.productList}>
          {filteredProducts.map((product) => (
            <div key={product._id || product.id} className={styles.productCard}>
              <div className={styles.productInfo}>
                <p className={styles.productName}>{product.name}</p>
                <p className={styles.productPrice}>R${product.price}</p>
                <span className={styles.categoryBadge}>{product.category}</span>
              </div>
              <div className={styles.productActions}>
                <button
                  onClick={() => handleAddProduct(product)}
                  className={styles.addButton}
                  type="button"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className={styles.deleteButton}
                  type="button"
                  title="Remover produto"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>Nenhum produto encontrado. Adicione produtos em /add-product.</p>
      )}
      {selectedProducts.length > 0 && (
        <div className={styles.cartItems}>
          {selectedProducts.map((p, index) => (
            <CartItemCard key={index} product={p} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;