import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  History, 
  Home, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Bike,
  DollarSign,
  Calculator
} from "lucide-react";
import styles from "./AppSidebar.module.css";
import { useNavigate } from "react-router-dom";

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div 
      className={styles.sidebar}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '16rem',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: '#1a202c',
        color: '#e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Cabeçalho */}
      <div className={styles.sidebarHeader}>
        <div className={styles.logoContainer}>
          <Bike className={styles.logoIcon} />
          <span className={styles.logoText}>NaHora!</span>
        </div>
      </div>
      
      {/* Conteúdo da Sidebar */}
      <div className={styles.sidebarContent}>
        <div className={styles.menu}>
          <Link to="/deliveries" className={styles.menuItem}>
            <Home className={styles.menuIcon} />
            Visão Geral
          </Link>

          <Link to="/active-deliveries" className={styles.menuItem}>
            <Package className={styles.menuIcon} />
            Entregas Ativas
          </Link>

          <Link to="/history" className={styles.menuItem}>
            <History className={styles.menuIcon} />
            Histórico
          </Link>

          <Link to="/new-delivery" className={styles.menuItem}>
            <PlusCircle className={styles.menuIcon} />
            Nova Entrega
          </Link>

          <Link to="/pricing" className={styles.menuItem}>
            <DollarSign className={styles.menuIcon} />
            Tabela de Preços
          </Link>

          <Link to="/pricing-simulation" className={styles.menuItem}>
            <Calculator className={styles.menuIcon} />
            Simulação de Preços
          </Link>

          <Link to="/settings" className={styles.menuItem}>
            <Settings className={styles.menuIcon} />
            Configurações
          </Link>
        </div>
      </div>

      {/* Rodapé - Logout */}
      <div className={styles.sidebarFooter}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut className={styles.logoutIcon} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}

export default AppSidebar;