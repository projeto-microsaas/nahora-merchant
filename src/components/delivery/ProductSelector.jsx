import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Package, ShoppingCart } from 'lucide-react';
import axios from '@/lib/axios';

const productIcons = {
  'Alimento': '🍽️',
  'Bebida': '🥤',
  'Medicamento': '💊',
  'Documento': '📄',
  'Eletrônico': '📱',
  'Roupa': '👕',
  'Casa': '🏠',
  'Automotivo': '🚗',
  'Ferramenta': '🔧',
  'Outros': '📦'
};

const ProductSelector = ({ selectedProducts, onProductsChange }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Outros',
    description: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      // Se não houver produtos, criar alguns exemplos
      setProducts([
        {
          _id: '1',
          name: 'Hambúrguer',
          price: 15.90,
          category: 'Alimento',
          description: 'Hambúrguer artesanal'
        },
        {
          _id: '2',
          name: 'Refrigerante',
          price: 4.50,
          category: 'Bebida',
          description: 'Refrigerante 350ml'
        },
        {
          _id: '3',
          name: 'Medicamento',
          price: 25.00,
          category: 'Medicamento',
          description: 'Medicamento prescrito'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductToggle = (product) => {
    const isSelected = selectedProducts.some(p => p._id === product._id);
    
    if (isSelected) {
      onProductsChange(selectedProducts.filter(p => p._id !== product._id));
    } else {
      onProductsChange([...selectedProducts, product]);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Preencha nome e preço do produto');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('/api/products', {
        ...newProduct,
        price: parseFloat(newProduct.price)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProducts([...products, response.data]);
      setNewProduct({ name: '', price: '', category: 'Outros', description: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      // Adicionar localmente se a API falhar
      const tempProduct = {
        _id: Date.now().toString(),
        ...newProduct,
        price: parseFloat(newProduct.price)
      };
      setProducts([...products, tempProduct]);
      setNewProduct({ name: '', price: '', category: 'Outros', description: '' });
      setShowAddForm(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTotalPrice = () => {
    return selectedProducts.reduce((total, product) => total + product.price, 0);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando produtos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Produtos da Entrega
        </h3>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Produto
        </Button>
      </div>

      {/* Formulário para adicionar produto */}
      {showAddForm && (
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">➕ Novo Produto</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <Input
                  placeholder="Ex: Pizza Margherita"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Preço (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 25.90"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  {Object.keys(productIcons).map(category => (
                    <option key={category} value={category}>
                      {productIcons[category]} {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Input
                  placeholder="Ex: Pizza com molho de tomate e mussarela"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddProduct} size="sm">
                Adicionar
              </Button>
              <Button 
                onClick={() => setShowAddForm(false)} 
                variant="outline" 
                size="sm"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar produtos por nome ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de produtos */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h4>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Tente outro termo de busca' : 'Adicione produtos para começar'}
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Primeiro Produto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const isSelected = selectedProducts.some(p => p._id === product._id);
            return (
              <Card
                key={product._id}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'ring-2 ring-orange-500 bg-orange-50' 
                    : 'hover:shadow-md hover:scale-105'
                }`}
                onClick={() => handleProductToggle(product)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {productIcons[product.category] || '📦'}
                      </span>
                      <div>
                        <h4 className="font-semibold">{product.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        R$ {product.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      isSelected ? 'text-orange-600' : 'text-gray-500'
                    }`}>
                      {isSelected ? '✓ Selecionado' : 'Clique para selecionar'}
                    </span>
                    {isSelected && (
                      <Badge className="bg-orange-500 text-white">
                        Selecionado
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Resumo dos produtos selecionados */}
      {selectedProducts.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Produtos Selecionados ({selectedProducts.length})
            </h4>
            <div className="space-y-2">
              {selectedProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{productIcons[product.category] || '📦'}</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <span className="text-green-600 font-semibold">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">R$ {getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductSelector;
