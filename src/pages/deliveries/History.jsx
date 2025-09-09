import React, { useState, useEffect } from "react";
import { SidebarProvider, Sidebar } from "../../components/ui/sidebar";
import { Bike } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";
import DeliveryHistoryTable from "../../components/dashboard/DeliveryHistoryTable";
import { Link } from "react-router-dom";
import styles from "./History.module.css";
import AppSidebar from "../../components/layout/AppSidebar";


// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div>Erro capturado: {this.state.error?.message || "Erro desconhecido"}</div>;
    }
    return this.props.children;
  }
}

const History = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Token de autenticação não encontrado");
        }

        const response = await fetch(
          `http://localhost:5000/api/deliveries/history?search=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`, // URL absoluta
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao buscar histórico: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data.deliveries)) {
          throw new Error("Dados de entregas inválidos: 'deliveries' não é um array");
        }
        if (isMounted) {
          setDeliveries(data.deliveries);
          setTotal(data.total || 0);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [searchTerm, page, limit]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (error) {
    return <div className={styles.error}>Erro: {error}</div>;
  }

  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className={styles.dashboardLayout}>
                <AppSidebar />
          <main className={styles.mainContent}>
            <header className={styles.header}>
              <div>
                <h1 className={styles.title}>Histórico de Entregas</h1>
                <p className={styles.subtitle}>Visualize o histórico completo das suas entregas.</p>
              </div>
              <Link to="/new-delivery" className={styles.newDeliveryButton}>
                Nova Entrega
              </Link>
            </header>
            <div className={styles.searchContainer}>
              <div className={styles.relative}>
                <Search className={styles.searchIcon} />
                <Input
                  type="search"
                  placeholder="Buscar no histórico por cliente, endereço ou ID..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <DeliveryHistoryTable deliveries={deliveries} />
            {total > limit && (
              <div className={styles.pagination}>
                <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                  Anterior
                </Button>
                <span>{`Página ${page} de ${Math.ceil(total / limit)}`}</span>
                <Button onClick={() => handlePageChange(page + 1)} disabled={page === Math.ceil(total / limit)}>
                  Próxima
                </Button>
              </div>
            )}
          </main>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};

export default History;