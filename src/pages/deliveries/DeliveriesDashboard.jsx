import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import socket from '../../lib/socket';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Package, Truck, Clock, DollarSign, Server, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './DeliveriesDashboard.module.css';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const DeliveriesDashboard = () => {
  const [stats, setStats] = useState({});
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState({ status: 'all', date: '', search: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      socket.connect();
      fetchData(token);

      socket.on('deliveryUpdate', (data) => {
        setAlerts(prev => [{ ...data, id: Date.now(), timestamp: new Date().toLocaleTimeString() }, ...prev]);
        fetchData(token);
      });

      socket.on('newDelivery', (data) => {
        setAlerts(prev => [{ message: 'Nova entrega recebida', payload: data, id: Date.now(), timestamp: new Date().toLocaleTimeString() }, ...prev]);
        fetchData(token);
      });

      return () => {
        socket.off('deliveryUpdate');
        socket.off('newDelivery');
        socket.disconnect();
      };
    } else {
      setError('Nenhum token de autenticação encontrado.');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const statsResponse = await axios.get('/api/stats', { headers: { Authorization: `Bearer ${token}` } });
      setStats(statsResponse.data || {});

      const deliveriesResponse = await axios.get('/api/deliveries', {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: filter.status === 'all' ? undefined : filter.status },
      });
      setActiveDeliveries(deliveriesResponse.data || []);

      const historyResponse = await axios.get('/api/deliveries/history', {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: filter.search, page: 1, limit: 10, status: 'all' },
      });
      setHistory(historyResponse.data.deliveries || []);

      const now = new Date();
      const delayedDeliveries = (deliveriesResponse.data || []).filter((d) => {
        const created = new Date(d.createdAt);
        return created && (now - created) > 3600000 && d.status === 'pending';
      });
      if (delayedDeliveries.length > 0) {
        setAlerts(prev => [{ message: `${delayedDeliveries.length} entrega(s) atrasada(s)`, id: Date.now(), timestamp: new Date().toLocaleTimeString() }, ...prev]);
      }
    } catch (err) {
      setError(`Erro ao carregar dados: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelivery = async (deliveryId, reason) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`/api/deliveries/${deliveryId}/cancel`, { reason }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData(token);
    } catch (err) {
      setError(`Erro ao cancelar entrega: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleCompleteDelivery = async (deliveryId, note) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`/api/deliveries/${deliveryId}/complete`, { note }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData(token);
    } catch (err) {
      setError(`Erro ao completar entrega: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleTrackClick = (id) => navigate(`/delivery-status/${id}`, { replace: true });

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const totalDelivered = stats.totalDeliveries ?? (history.length + activeDeliveries.length);
  const cancelled = stats.cancelledDeliveries ?? (history.filter(h => h.status === 'cancelled').length);
  const cancelRate = totalDelivered > 0 ? ((cancelled / totalDelivered) * 100).toFixed(1) : '0.0';

  const dailyDeliveries = stats.dailyDeliveries || {};

  return (
    <DashboardLayout>
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>Dados baseados no seu painel de controle de entregas.</p>
          </div>
          <Link to="/new-delivery" className={styles.newDeliveryButton}>Nova Entrega</Link>
        </header>

        {/* Estatísticas */}
        <div className={styles.statsGrid}>
          <Card className={styles.statCard}>
            <CardHeader className={styles.statCardHeader}>
              <CardTitle>Entregas Hoje</CardTitle>
              <Package size={20} className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <p className={styles.statValue}>{stats.totalDeliveries ?? 0}</p>
              <p className={styles.statDescription}>Entregas de hoje</p>
            </CardContent>
          </Card>

          <Card className={styles.statCard}>
            <CardHeader className={styles.statCardHeader}>
              <CardTitle>Entregas em Andamento</CardTitle>
              <Truck size={20} className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <p className={styles.statValue}>{stats.pendingDeliveries ?? activeDeliveries.length}</p>
              <p className={styles.statDescription}>Entregas em rota</p>
            </CardContent>
          </Card>

          <Card className={styles.statCard}>
            <CardHeader className={styles.statCardHeader}>
              <CardTitle>Tempo Médio</CardTitle>
              <Clock size={20} className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <p className={styles.statValue}>{stats.averageTime ? `${stats.averageTime} min` : '0 min'}</p>
              <p className={styles.statDescription}>Média das últimas 24h</p>
            </CardContent>
          </Card>

          <Card className={styles.statCard}>
            <CardHeader className={styles.statCardHeader}>
              <CardTitle>Faturamento do Dia</CardTitle>
              <DollarSign size={20} className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <p className={styles.statValue}>R${(stats.totalRevenue ?? 0).toFixed(2)}</p>
              <p className={styles.statDescription}>Entregas realizadas</p>
            </CardContent>
          </Card>

          <Card className={styles.statCard}>
            <CardHeader className={styles.statCardHeader}>
              <CardTitle>Status do Sistema</CardTitle>
              <Server size={20} className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <p className={styles.statValue}>{stats.motoboysAvailable ?? 0}</p>
              <p className={styles.statDescription}>Motoboys disponíveis</p>
            </CardContent>
          </Card>

          <Card className={styles.statCard}>
            <CardHeader className={styles.statCardHeader}>
              <CardTitle>Taxa de Cancelamento</CardTitle>
              <XCircle size={20} className={styles.cardIcon} />
            </CardHeader>
            <CardContent>
              <p className={styles.statValue}>{cancelRate}%</p>
              <p className={styles.statDescription}>Percentual sobre entregas</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className={styles.chartsGrid}>
          <Card className={styles.performanceCard}>
            <CardHeader className={styles.title}>
              <CardTitle>Performance de Entregas</CardTitle>
            </CardHeader>
            <CardContent className={styles.chartContent}>
              <p>Total de entregas dos últimos 7 dias</p>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={Object.entries(dailyDeliveries).map(([day, value]) => ({
                      day,
                      entregas: value?.v || 0,
                    }))}
                    margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="entregas" fill="#FF7300" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className={styles.statCard}>
            <CardHeader className={styles.title}>
              <CardTitle>Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent className={styles.statCardContent}>
              <p className={styles.statValue}>{stats.motoboysNearby ?? 0}</p>
              <p className={styles.statDescription}>Motoboys próximos</p>
              <p className={styles.statValue}>{stats.motoboysOnline ?? 0}</p>
              <p className={styles.statDescription}>Motoboys online</p>
              <p className={styles.statValue}>{stats.averageAcceptTime ?? '~'}</p>
              <p className={styles.statDescription}>Tempo de aceite</p>
              <p className={styles.statDescription}>
                <span className={styles.statusBadge} style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                  Operacional
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FILTROS (Abaixo dos gráficos) */}
        <div className={styles.filterSection}>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className={styles.filterSelect}
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="scheduled">Agendado</option>
            <option value="accepted">Aceito</option>
            <option value="completed">Concluído</option>
            <option value="cancelled">Cancelado</option>
          </select>

          <input
            type="date"
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
            className={styles.filterDate}
          />

          <input
            type="text"
            placeholder="Buscar por cliente, endereço ou ID"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className={styles.filterSearch}
          />

          <button onClick={() => fetchData(localStorage.getItem('authToken'))} className={styles.filterButton}>
            Filtrar
          </button>
        </div>

        {/* Entregas Ativas */}
        <div className={styles.deliveriesSection}>
          <h2 className={styles.deliveriesTitle}>Entregas Ativas</h2>
          <div className={styles.deliveriesGrid}>
            {activeDeliveries.map((delivery) => (
              <Card key={delivery._id} className={styles.deliveryCard}>
                <CardHeader className={styles.statCardHeader}>
                  <span>{delivery._id || 'Sem ID'}</span>
                  <span
                    className={`${styles.status} ${styles[delivery.status] || ''}`}
                    style={{
                      backgroundColor:
                        delivery.status === 'pending'
                          ? '#fef3c7'
                          : delivery.status === 'scheduled'
                          ? '#dbeafe'
                          : delivery.status === 'accepted'
                          ? '#e0e7ff'
                          : delivery.status === 'completed'
                          ? '#dcfce7'
                          : '#fee2e2',
                      color:
                        delivery.status === 'pending'
                          ? '#92400e'
                          : delivery.status === 'scheduled'
                          ? '#1e40af'
                          : delivery.status === 'accepted'
                          ? '#312e81'
                          : delivery.status === 'completed'
                          ? '#166534'
                          : '#991b1b',
                    }}
                  >
                    {delivery.status || 'Desconhecido'}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className={styles.deliveryDetails}>{delivery.customer || 'Sem cliente'}</p>
                  <p className={styles.deliveryDetails}>{delivery.address || 'Sem endereço'}</p>
                  <p className={styles.deliveryDetails}>
                    {delivery.createdAt ? `${Math.floor((new Date() - new Date(delivery.createdAt)) / 60000)} min atrás` : 'Sem tempo'}
                  </p>
                  {delivery.scheduledAt && (
                    <p className={styles.deliveryDetails}>Agendado para: {new Date(delivery.scheduledAt).toLocaleString()}</p>
                  )}
                </CardContent>
                <CardContent className={styles.deliveryFooter}>
                  {delivery._id && (
                    <>
                      <span onClick={() => handleTrackClick(delivery._id)} className={styles.trackLink} style={{ cursor: 'pointer', marginRight: '10px' }}>
                        Rastrear
                      </span>

                      {['pending', 'scheduled'].includes(delivery.status) && (
                        <button onClick={() => {
                          const reason = prompt('Justifique o cancelamento:');
                          if (reason) handleCancelDelivery(delivery._id, reason);
                        }} className={styles.cancelButton}>Cancelar</button>
                      )}

                      {delivery.status === 'accepted' && (
                        <button onClick={() => {
                          const note = prompt('Adicione uma nota (opcional):');
                          handleCompleteDelivery(delivery._id, note);
                        }} className={styles.completeButton}>Concluir</button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Histórico */}
        <div className={styles.historySection}>
          <h2 className={styles.deliveriesTitle}>Histórico de Entregas</h2>
          <div className={styles.deliveriesGrid}>
            {history.map((delivery) => (
              <Card key={delivery._id} className={styles.deliveryCard}>
                <CardHeader className={styles.statCardHeader}>
                  <span>{delivery._id || 'Sem ID'}</span>
                  <span
                    className={`${styles.status} ${styles[delivery.status] || ''}`}
                    style={{
                      backgroundColor:
                        delivery.status === 'completed'
                          ? '#dcfce7'
                          : delivery.status === 'cancelled'
                          ? '#fee2e2'
                          : '#e5e7eb',
                      color:
                        delivery.status === 'completed'
                          ? '#166534'
                          : delivery.status === 'cancelled'
                          ? '#991b1b'
                          : '#374151',
                    }}
                  >
                    {delivery.status || 'Desconhecido'}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className={styles.deliveryDetails}>{delivery.customer || 'Sem cliente'}</p>
                  <p className={styles.deliveryDetails}>{delivery.address || 'Sem endereço'}</p>
                  <p className={styles.deliveryDetails}>{delivery.completedAt ? new Date(delivery.completedAt).toLocaleString() : 'Sem data'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Alertas */}
        {alerts.length > 0 && (
          <div className={styles.alertsSection}>
            <h3>Alertas</h3>
            <ul>
              {alerts.map((alert) => (
                <li key={alert.id}>
                  {alert.message || `${alert.status} - ${alert.note || alert.reason}`} - {alert.timestamp}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
};

export default DeliveriesDashboard;