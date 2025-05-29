import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import MerchantHomeScreen from './components/merchant/MerchantHomeScreen.jsx'; // Ajuste o caminho conforme necessário

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} /> {/* Apenas para login */}
      <Route path="/" element={<MerchantHomeScreen />} /> {/* Rota para a tela do lojista */}
    </Routes>
  );
};

export default App;