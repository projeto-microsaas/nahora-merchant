import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import DeliveriesDashboard from './pages/deliveries/DeliveriesDashboard';
import NewDeliveryPage from './pages/deliveries/NewDeliveryPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DeliveryStatusPage from './pages/deliveries/DeliveryStatusPage';
import History from './pages/deliveries/History';
import AddProductPage from './pages/products/AddProductPage';
import Settings from './pages/deliveries/SettingsPage';
import ActiveDeliveries from './pages/deliveries/ActiveDeliveries';

function App() {
  console.log('App renderizado');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/deliveries" element={<DeliveriesDashboard />} />
        <Route path="/new-delivery" element={<NewDeliveryPage />} />
        <Route path="/delivery-status/:id" element={<DeliveryStatusPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/active-deliveries" element={<ActiveDeliveries />} />
      </Routes>
    </Router>
  );
}

export default App;



