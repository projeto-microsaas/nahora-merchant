import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Package } from 'lucide-react';
import styles from './MerchantTabHeader.module.css';

const MerchantTabHeader = ({ activeTab, setActiveTab }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
<img
  src="/logo.png"
  alt="Logo da Plataforma"
  className={styles.logo}
  onError={(e) => {
    e.target.style.display = 'none';
    console.log('Imagem não encontrada');
  }}
/>
        <h1 className={styles.title}>Nahora Merchant</h1>
      </div>
      <nav className={styles.nav}>
        <Button
          className={`${styles.tabButton} ${activeTab === 'home' ? styles.active : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home className={styles.icon} />
          Início
        </Button>
        <Button
          className={`${styles.tabButton} ${activeTab === 'products' ? styles.active : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package className={styles.icon} />
          Produtos
        </Button>
      </nav>
    </header>
  );
};

export default MerchantTabHeader;