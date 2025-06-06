import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import DeliveriesDashboard from './pages/deliveries/DeliveriesDashboard';
import NewDeliveryPage from './pages/deliveries/NewDeliveryPage'; // Nova rota
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage'; // Nova rota

function App() {
  console.log('App renderizado');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/deliveries" element={<DeliveriesDashboard />} />
        <Route path="/new-delivery" element={<NewDeliveryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;