import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {Input} from '@/components/ui/input/input'; // Correção para default import
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon } from 'lucide-react';

const AddProductPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (image) formData.append('image', image);

    try {
      await axios.post('/api/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Produto adicionado com sucesso!');
      navigate('/merchant');
    } catch (error) {
      toast.error('Erro ao adicionar produto.');
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Adicionar Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nome do Produto</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Digite o nome do produto" required />
        </div>
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva o produto" required />
        </div>
        <div>
          <Label htmlFor="price">Preço (R$)</Label>
          <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Digite o preço" step="0.01" required />
        </div>
        <div>
          <Label htmlFor="image">Imagem do Produto</Label>
          <div className="flex items-center space-x-2">
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <Button type="button" variant="outline" onClick={() => document.getElementById('image').click()}>
              <Upload className="w-4 h-4 mr-2" /> Escolher Imagem
            </Button>
            {image && <span className="text-sm text-gray-500">{image.name}</span>}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button type="submit">
            <ImageIcon className="w-4 h-4 mr-2" /> Adicionar Produto
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/merchant')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage; // Exportação default