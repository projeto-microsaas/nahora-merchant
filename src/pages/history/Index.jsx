import React, { useState, useEffect } from "react";
import AppSidebar from "../../components/layout/AppSidebar";
import DeliveryHistoryTable from "../../components/dashboard/DeliveryHistoryTable";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";

const History = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/api/deliveries", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar histórico de entregas");
        }

        const data = await response.json();
        setDeliveries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <AppSidebar />
        <div style={{ 
          marginLeft: '16rem', 
          padding: '2rem', 
          width: 'calc(100% - 16rem)',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#f9fafb'
        }}>
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Carregando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <AppSidebar />
        <div style={{ 
          marginLeft: '16rem', 
          padding: '2rem', 
          width: 'calc(100% - 16rem)',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#f9fafb'
        }}>
          <div style={{ textAlign: 'center', padding: '2rem', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', margin: '1rem 0' }}>Erro: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AppSidebar />
      <div style={{ 
        marginLeft: '16rem', 
        padding: '2rem', 
        width: 'calc(100% - 16rem)',
        background: '#f9fafb'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          width: '100%',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          padding: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>Histórico de Entregas</h1>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>Visualize o histórico completo das suas entregas.</p>
            </div>
            <button 
              style={{
                background: '#ff7300',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onClick={() => window.location.href = "/new-delivery"}
            >
              Nova Entrega
            </button>
          </div>
          
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', width: '1rem', height: '1rem' }} />
            <input
              type="search"
              placeholder="Buscar no histórico por cliente, endereço ou ID..."
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                background: 'white'
              }}
            />
          </div>
          
          <DeliveryHistoryTable deliveries={deliveries} />
        </div>
      </div>
    </div>
  );
};

export default History;