import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import DashboardLayout from '../../components/layout/DashboardLayout';
import styles from './AddProductPage.module.css';

const AddProductPage = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Categorias com ícones
  const categories = {
    'Alimento': { icon: '🍽️', color: '#FF6B6B' },
    'Bebida': { icon: '🥤', color: '#4ECDC4' },
    'Eletrônico': { icon: '📱', color: '#45B7D1' },
    'Roupa': { icon: '👕', color: '#96CEB4' },
    'Casa': { icon: '🏠', color: '#FFEAA7' },
    'Saúde': { icon: '💊', color: '#DDA0DD' },
    'Livro': { icon: '📚', color: '#98D8C8' },
    'Esporte': { icon: '⚽', color: '#F7DC6F' },
    'Beleza': { icon: '💄', color: '#BB8FCE' },
    'Outros': { icon: '📦', color: '#85C1E9' }
  };

  const API_URL = 'http://localhost:5000/api/products';

  // Buscar produtos cadastrados
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Token de autenticação não encontrado.');

        const response = await fetch(API_URL, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Erro ao buscar produtos');
        }

        const data = await response.json();
        console.log('Produtos carregados:', data);
        setProducts(data);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError('Não foi possível carregar os produtos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Criar novo produto
  const onSubmit = async (data) => {
    try {
      if (!data.name || !data.price) throw new Error('Nome e preço são obrigatórios.');

      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Token de autenticação não encontrado.');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          price: parseFloat(data.price),
          category: data.category || 'Outros',
          icon: data.category ? categories[data.category]?.icon || '📦' : '📦',
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Erro ao criar produto');
      }

      const newProduct = await response.json();
      setProducts([...products, newProduct]);
      reset();
      alert('Produto criado com sucesso!');
    } catch (err) {
      console.error('Erro ao criar produto:', err);
      alert(`Erro ao criar produto: ${err.message}`);
    }
  };

  // Deletar produto
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Token de autenticação não encontrado.');

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Erro ao excluir produto');
      }

      setProducts(products.filter(p => p._id !== id));
      alert('Produto excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      alert(`Erro ao excluir produto: ${err.message}`);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <DashboardLayout>
      <h1 className={styles.pageTitle}>Gerenciar Produtos</h1>

      {/* Adicionar Produto */}
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>Adicionar Novo Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Nome *</label>
              <input
                {...register('name', { required: 'Nome é obrigatório' })}
                className={styles.input}
                placeholder="Ex.: Produto Teste"
              />
              {errors.name && <p className={styles.error}>{errors.name.message}</p>}
            </div>
            <div className={styles.formGroup}>
              <label>Preço (R$) *</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { required: 'Preço é obrigatório', min: 0.01 })}
                className={styles.input}
                placeholder="Ex.: 10.50"
              />
              {errors.price && <p className={styles.error}>{errors.price.message}</p>}
            </div>
            <div className={styles.formGroup}>
              <label>Categoria</label>
              <div className={styles.categorySelector}>
                {Object.entries(categories).map(([category, { icon, color }]) => (
                  <div
                    key={category}
                    className={`${styles.categoryCard} ${selectedCategory === category ? styles.selected : ''}`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setValue('category', category);
                    }}
                    style={{ borderColor: selectedCategory === category ? color : '#e5e7eb' }}
                  >
                    <div className={styles.categoryIcon} style={{ color }}>
                      {icon}
                    </div>
                    <div className={styles.categoryLabel}>{category}</div>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" className={styles.submitButton}>Cadastrar Produto</Button>
          </form>
        </CardContent>
      </Card>

      {/* Produtos Cadastrados */}
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>Produtos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <ul className={styles.productList}>
              {products.map((product) => (
                <li key={product._id} className={styles.productItem}>
                  <span>{product.name} - R${product.price.toFixed(2)} ({product.category})</span>
                  <Button
                    onClick={() => handleDelete(product._id)}
                    className={styles.deleteButton}
                  >
                    Excluir
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyState}>Nenhum produto cadastrado.</p>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AddProductPage;
