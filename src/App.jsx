import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from './pages/Index';
import DeliveriesDashboard from './pages/deliveries/DeliveriesDashboard';
import NewDeliveryFormPage from './pages/deliveries/NewDeliveryPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DeliveryStatusPage from './pages/deliveries/DeliveryStatusPage';
import History from './pages/deliveries/History';
import AddProductPage from './pages/products/AddProductPage';
import Settings from './pages/deliveries/SettingsPage';
import ActiveDeliveries from './pages/deliveries/ActiveDeliveries';
import PricingPage from './pages/deliveries/PricingPage';
import PricingSimulationPage from './pages/deliveries/PricingSimulationPage';
import AddressManagement from './pages/addresses/AddressManagement';

const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/deliveries", element: <DeliveriesDashboard /> },
  { path: "/new-delivery", element: <NewDeliveryFormPage /> },
  { path: "/delivery-status/:id", element: <DeliveryStatusPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/add-product", element: <AddProductPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/history", element: <History /> },
  { path: "/settings", element: <Settings /> },
  { path: "/active-deliveries", element: <ActiveDeliveries /> },
  { path: "/pricing", element: <PricingPage /> },
  { path: "/pricing-simulation", element: <PricingSimulationPage /> },
  { path: "/addresses", element: <AddressManagement /> },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  console.log('App renderizado');
  return <RouterProvider router={router} />;
}

export default App;



