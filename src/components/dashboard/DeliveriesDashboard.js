import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../lib/axios';
import styles from './DeliveriesDashboard.module.css';

const DeliveriesDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    deliveriesToday: 0,
    activeDeliveries: 0,
    pendingDeliveries: 0,
    inRouteDeliveries: 0,
    averageTime: 0,
    dailyRevenue: 0,
  });
  const [systemStatus, setSystemStatus] = useState({
    motoboysOnline: 0,
    acceptanceTime: 0,
    status: 'Desconhecido',
  });
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Token de autenticação não encontrado');
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const [
          statsResponse,
          systemStatusResponse,
          activeDeliveriesResponse,
        ] = await Promise.all([
          axios.get('/api/stats', config),
          axios.get('/api/system-status', config),
          axios.get('/api/deliveries/active-deliveries', config),
        ]);

        setStats(statsResponse.data);
        setSystemStatus(systemStatusResponse.data);
        setActiveDeliveries(activeDeliveriesResponse.data);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError(err.response?.data?.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Atualiza a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>NaHora!</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <ul>
            <li className={styles.navItem}>
              <span className={styles.navIcon}>🏠</span> Dashboard
            </li>
            <li className={styles.navItem}>
              <span className={styles.navIcon}>📦</span> Entregas
            </li>
            <li className={styles.navItem}>
              <span className={styles.navIcon}>👤</span> Perfil
            </li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Dashboard de Entregas</h1>
            <p className={styles.subtitle}>Visão geral das suas entregas</p>
          </div>
          <button
            className={styles.newDeliveryButton}
            onClick={() => navigate('/new-delivery')}
          >
            Nova Entrega
          </button>
        </header>

        {/* Cards de Estatísticas */}
        {error && <p className={styles.errorMessage}>{error}</p>}
        <div className={styles.statsGrid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <span className={styles.cardTitleIcon}>📦</span> Entregas Hoje
              </div>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardContentNumber}>{stats.deliveriesToday}</p>
              <p className={styles.cardContentText}>2 entregas a mais que ontem</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <span className={styles.cardTitleIcon}>🚚</span> Entregas em Andamento
              </div>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardContentNumber}>{stats.activeDeliveries}</p>
              <p className={styles.cardContentText}>
                {stats.pendingDeliveries} pendentes, {stats.inRouteDeliveries} em rota
              </p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <span className={styles.cardTitleIcon}>⏱️</span> Tempo Médio
              </div>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardContentNumber}>{stats.averageTime} min</p>
              <p className={styles.cardContentText}>Média das últimas 24h</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <span className={styles.cardTitleIcon}>💰</span> Faturamento do Dia
              </div>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardContentNumber}>R$ {stats.dailyRevenue.toFixed(2)}</p>
              <p className={styles.cardContentText}>{stats.deliveriesToday} entregas realizadas</p>
            </div>
          </div>
        </div>

        {/* Seção de Gráficos */}
        <div className={styles.chartsGrid}>
          <div className={styles.performanceCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Performance de Entregas</h3>
              <p className={styles.cardSubtitle}>Total de entregas dos últimos 7 dias</p>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.chartPlaceholder}>
                <span className={styles.chartIcon}>📊</span>
              </div>
            </div>
          </div>

          <div className={styles.systemCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Status do Sistema</h3>
              <p className={styles.cardSubtitle}>Motoboys disponíveis próximos</p>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.systemStats}>
                <div className={styles.systemStatItem}>
                  <span className={styles.systemStatLabel}>Motoboys Online</span>
                  <span className={styles.systemStatValueGreen}>{systemStatus.motoboysOnline}</span>
                </div>
                <div className={styles.systemStatItem}>
                  <span className={styles.systemStatLabel}>Tempo de Aceite</span>
                  <span className={styles.systemStatValue}>~{systemStatus.acceptanceTime} min</span>
                </div>
                <div className={styles.systemStatItem}>
                  <span className={styles.systemStatLabel}>Status</span>
                  <span className={styles.systemStatusBadge}>{systemStatus.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Entregas Ativas */}
        <section className={styles.deliveriesSection}>
          <h2 className={styles.deliveriesTitle}>Entregas Ativas</h2>
          <div className={styles.deliveriesGrid}>
            {activeDeliveries.length > 0 ? (
              activeDeliveries.map((delivery) => (
                <div key={delivery.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                      Pedido #{delivery.id} - {delivery.name}
                    </div>
                    <span
                      className={
                        delivery.status === 'Pendente'
                          ? styles.badgePending
                          : delivery.status === 'Aceita'
                          ? styles.badgeAccepted
                          : styles.badgeInDelivery
                      }
                    >
                      {delivery.status}
                    </span>
                  </div>
                  <div className={styles.cardContent}>
                    <p><strong>Endereço:</strong> {delivery.address}</p>
                    <p><strong>Tempo:</strong> {delivery.timeAgo} min atrás</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhuma entrega ativa no momento.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DeliveriesDashboard;