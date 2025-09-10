import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import styles from './AddProductPage.module.css';

const AddProductPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Token de autenticação não encontrado.');
        }
        const response = await fetch('http://localhost:5000/api/products', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Erro ao buscar produtos');
        }
        const data = await response.json();
        console.log('Produtos carregados:', data);
        setProducts(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setError('Não foi possível carregar os produtos.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }
      console.log('Dados do formulário:', data); // Log para depuração
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          price: parseFloat(data.price),
          category: data.category || 'Sem Categoria',
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar produto');
      }
      const result = await response.json();
      console.log('Produto criado:', result);
      setProducts([...products, result]);
      reset();
      alert('Produto criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      alert(`Erro ao criar produto: ${error.message}. Verifique o console para mais detalhes.`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Erro ao excluir produto');
      }
      setProducts(products.filter(p => p._id !== id));
      alert('Produto excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert(`Erro ao excluir produto: ${error.message}.`);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Gerenciar Produtos</h1>
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
                {...register('price', { required: 'Preço é obrigatório', min: 0.01, max: 10000 })}
                className={styles.input}
                placeholder="Ex.: 10.50"
              />
              {errors.price && <p className={styles.error}>{errors.price.message}</p>}
            </div>
            <div className={styles.formGroup}>
              <label>Categoria</label>
              <input
                {...register('category')}
                className={styles.input}
                placeholder="Ex.: Alimento, Eletrônico"
              />
            </div>
            <Button type="submit" className={styles.submitButton}>Cadastrar Produto</Button>
          </form>
        </CardContent>
      </Card>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>Produtos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <ul className={styles.productList}>
              {products.map((product) => (
                <li key={product._id} className={styles.productItem}>
                  <span>{product.name} - R${product.price} ({product.category})</span>
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
    </div>
  );
};

export default AddProductPage;