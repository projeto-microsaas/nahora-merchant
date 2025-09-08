import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import styles from './ActiveDeliveries.module.css';

const ActiveDeliveries = () => {
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        const deliveriesResponse = await axios.get('/api/deliveries', {
          headers: { Authorization: `Bearer ${token}` },
          params: { status: 'pending' },
        });
        setActiveDeliveries(deliveriesResponse.data || []);
      } catch (error) {
        setError(`Erro ao carregar dados: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTrackClick = (id) => {
    navigate(`/delivery-status/${id}`, { replace: true });
  };

  // Filtro de busca
  const filteredDeliveries = activeDeliveries.filter((delivery) => {
    const searchLower = search.toLowerCase();
    return (
      (delivery.customer && delivery.customer.toLowerCase().includes(searchLower)) ||
      (delivery.address && delivery.address.toLowerCase().includes(searchLower)) ||
      (delivery._id && delivery._id.toLowerCase().includes(searchLower))
    );
  });

  return (
    <DashboardLayout>
      <main className={styles.main}>
        {/* Cabeçalho */}
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.pageTitle}>Entregas Ativas</h1>
            <p className={styles.pageSubtitle}>
              Acompanhe todas as suas entregas em andamento.
            </p>
          </div>
          <Link to="/new-delivery" className={styles.newDeliveryButton}>
            Nova Entrega
          </Link>
        </div>

        {/* Barra de Pesquisa */}
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="search"
            placeholder="Buscar entregas por cliente, endereço ou ID..."
            className={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Grid de Entregas */}
        <div className={styles.deliveriesGrid}>
          {loading && <div className={styles.loading}>Carregando...</div>}
          {error && <div className={styles.error}>{error}</div>}
          {!loading && !error && filteredDeliveries.length === 0 && (
            <p className={styles.noDeliveries}>Nenhuma entrega ativa encontrada.</p>
          )}
          {filteredDeliveries.map((delivery) => (
            <Card key={delivery._id} className={styles.deliveryCard}>
              <CardHeader className={styles.statCardHeader}>
                <span>{delivery._id || 'Sem ID'}</span>
                <span
                  className={styles.statusBadge}
                  style={{
                    backgroundColor:
                      delivery.status === 'pending'
                        ? '#fef3c7'
                        : delivery.status === 'accepted'
                        ? '#dbeafe'
                        : delivery.status === 'collected'
                        ? '#dcfce7'
                        : '#e5e7eb',
                    color:
                      delivery.status === 'pending'
                        ? '#92400e'
                        : delivery.status === 'accepted'
                        ? '#1e40af'
                        : delivery.status === 'collected'
                        ? '#166534'
                        : '#374151',
                  }}
                >
                  {delivery.status || 'Desconhecido'}
                </span>
              </CardHeader>
              <CardContent>
                <p className={styles.customer}>{delivery.customer || 'Sem cliente'}</p>
                <p className={styles.address}>{delivery.address || 'Sem endereço'}</p>
                <p className={styles.time}>
                  {delivery.createdAt
                    ? `${Math.floor((new Date() - new Date(delivery.createdAt)) / 60000)} min atrás`
                    : 'Sem tempo'}
                </p>
              </CardContent>
              <CardContent className={styles.deliveryFooter}>
                {delivery._id && (
                  <span
                    onClick={() => handleTrackClick(delivery._id)}
                    className={styles.trackLink}
                    style={{ cursor: 'pointer' }}
                  >
                    Rastrear
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default ActiveDeliveries;