import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MerchantTabHeader from '../../components/merchant/MerchantTabHeader';
import MerchantHomeScreen from '@/components/merchant/MerchantHomeScreen';
import { Outlet } from 'react-router-dom';
import styles from 'src/pages/merchant/MerchantApp.module.css';

const MerchantApp = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token || token === 'fake-token') {
      console.log('Token inválido ou ausente, redirecionando para login...');
      navigate('/login');
      return;
    }

    console.log('MerchantApp mounted');
    return () => console.log('MerchantApp unmounted');
  }, [navigate]);

  return (
    <div className={styles.container}>
      <MerchantTabHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'home' ? <MerchantHomeScreen /> : <Outlet />}
    </div>
  );
};

export default MerchantApp;