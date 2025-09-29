import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import axios from '../../lib/axios';
import DashboardLayout from '../../components/layout/DashboardLayout';
import styles from './AddressManagement.module.css';

const AddressManagement = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'pickup',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    complement: '',
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get('/api/addresses');
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
      toast.error('Erro ao carregar endereços');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await axios.put(`/api/addresses/${editingAddress._id}`, formData);
        toast.success('Endereço atualizado com sucesso!');
      } else {
        await axios.post('/api/addresses', formData);
        toast.success('Endereço criado com sucesso!');
      }
      
      setShowForm(false);
      setEditingAddress(null);
      setFormData({
        type: 'pickup',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        complement: '',
        isDefault: false
      });
      fetchAddresses();
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      toast.error('Erro ao salvar endereço');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      street: address.street,
      number: address.number,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      complement: address.complement,
      isDefault: address.isDefault
    });
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
      try {
        await axios.delete(`/api/addresses/${addressId}`);
        toast.success('Endereço excluído com sucesso!');
        fetchAddresses();
      } catch (error) {
        console.error('Erro ao excluir endereço:', error);
        toast.error('Erro ao excluir endereço');
      }
    }
  };

  const handleNewAddress = () => {
    setEditingAddress(null);
    setFormData({
      type: 'pickup',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      complement: '',
      isDefault: false
    });
    setShowForm(true);
  };

  const pickupAddresses = addresses.filter(addr => addr.type === 'pickup');
  const deliveryAddresses = addresses.filter(addr => addr.type === 'delivery');

  if (loading) {
    return (
      <SidebarProvider>
        <div className={styles.pageContainer}>
          <AppSidebar className={styles.sidebar} />
          <div className={styles.mainContent}>
            <div className={styles.loading}>Carregando endereços...</div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Gerenciar Endereços</h1>
            <Button onClick={handleNewAddress} className={styles.newButton}>
              + Novo Endereço
            </Button>
          </div>

          {showForm && (
            <Card className={styles.formCard}>
              <CardHeader>
                <CardTitle>
                  {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <Label htmlFor="type">Tipo</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pickup">Coleta</SelectItem>
                          <SelectItem value="delivery">Entrega</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className={styles.formGroup}>
                      <Label htmlFor="street">Rua</Label>
                      <Input
                        id="street"
                        value={formData.street}
                        onChange={(e) => setFormData({...formData, street: e.target.value})}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        value={formData.number}
                        onChange={(e) => setFormData({...formData, number: e.target.value})}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        value={formData.complement}
                        onChange={(e) => setFormData({...formData, complement: e.target.value})}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.isDefault}
                          onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                        />
                        Endereço padrão
                      </label>
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <Button type="submit" className={styles.saveButton}>
                      {editingAddress ? 'Atualizar' : 'Criar'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className={styles.addressesGrid}>
            <div className={styles.addressSection}>
              <h2 className={styles.sectionTitle}>Endereços de Coleta</h2>
              {pickupAddresses.length === 0 ? (
                <p className={styles.emptyMessage}>Nenhum endereço de coleta cadastrado</p>
              ) : (
                <div className={styles.addressList}>
                  {pickupAddresses.map((address) => (
                    <Card key={address._id} className={styles.addressCard}>
                      <CardContent>
                        <div className={styles.addressInfo}>
                          <div className={styles.addressHeader}>
                            <h3 className={styles.addressTitle}>
                              {address.street}, {address.number}
                              {address.isDefault && <span className={styles.defaultBadge}>Padrão</span>}
                            </h3>
                            <div className={styles.addressActions}>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEdit(address)}
                              >
                                Editar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDelete(address._id)}
                              >
                                Excluir
                              </Button>
                            </div>
                          </div>
                          <p className={styles.addressDetails}>
                            {address.neighborhood}, {address.city} - {address.state}
                            {address.complement && `, ${address.complement}`}
                          </p>
                          {address.zipCode && (
                            <p className={styles.zipCode}>CEP: {address.zipCode}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.addressSection}>
              <h2 className={styles.sectionTitle}>Endereços de Entrega</h2>
              {deliveryAddresses.length === 0 ? (
                <p className={styles.emptyMessage}>Nenhum endereço de entrega cadastrado</p>
              ) : (
                <div className={styles.addressList}>
                  {deliveryAddresses.map((address) => (
                    <Card key={address._id} className={styles.addressCard}>
                      <CardContent>
                        <div className={styles.addressInfo}>
                          <div className={styles.addressHeader}>
                            <h3 className={styles.addressTitle}>
                              {address.street}, {address.number}
                              {address.isDefault && <span className={styles.defaultBadge}>Padrão</span>}
                            </h3>
                            <div className={styles.addressActions}>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEdit(address)}
                              >
                                Editar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDelete(address._id)}
                              >
                                Excluir
                              </Button>
                            </div>
                          </div>
                          <p className={styles.addressDetails}>
                            {address.neighborhood}, {address.city} - {address.state}
                            {address.complement && `, ${address.complement}`}
                          </p>
                          {address.zipCode && (
                            <p className={styles.zipCode}>CEP: {address.zipCode}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
    </DashboardLayout>
  );
};

export default AddressManagement;
