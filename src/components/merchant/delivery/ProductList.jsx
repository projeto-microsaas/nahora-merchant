// src/components/merchant/delivery/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Search } from 'lucide-react';
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

  if (loading) return <div>Carregando produtos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produtos..."
          className={styles.searchInput}
        />
        <Search className={styles.searchIcon} />
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
              <button
                onClick={() => handleAddProduct(product)}
                className={styles.addButton}
                type="button"
              >
                Adicionar
              </button>
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