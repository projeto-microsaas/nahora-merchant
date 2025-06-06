// src/components/layout/DashboardLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Merchant</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <ul>
            <li className={styles.navItem}><Link to="/merchant/home">Dashboard</Link></li>
            <li className={styles.navItem}><Link to="/deliveries">Entregas</Link></li>
            <li className={styles.navItem}><Link to="/history">Histórico</Link></li>
            <li className={styles.navItem}><Link to="/new-delivery">Nova Entrega</Link></li>
            <li className={styles.navItem}><Link to="/settings">Configurações</Link></li>
          </ul>
        </nav>
      </aside>
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default DashboardLayout;