import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/Index';
import Deliveries from './pages/deliveries/Index';
import DeliveriesDashboard from './pages/deliveries/DeliveriesDashboard'; // Adicione
import History from './pages/history/Index';
import NewDelivery from './pages/new-delivery/Index';
import SettingsPage from './pages/SettingsPage';
import TrackDelivery from './pages/track-delivery/Index';
import NotFound from './pages/NotFound';
import ProtectedRoute from './pages/ProtectedRoute';

const router = createBrowserRouter([
  { path: '/', element: <LoginPage />, errorElement: <NotFound /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/merchant/home', element: <Dashboard />, errorElement: <NotFound /> },
  { path: '/deliveries', element: <Deliveries />, errorElement: <NotFound /> },
  { path: '/deliveries/dashboard', element: <DeliveriesDashboard />, errorElement: <NotFound /> }, // Adicione
  { path: '/history', element: <History />, errorElement: <NotFound /> },
  { path: '/new-delivery', element: <ProtectedRoute><NewDelivery /></ProtectedRoute>, errorElement: <NotFound /> },
  { path: '/settings', element: <ProtectedRoute><SettingsPage /></ProtectedRoute>, errorElement: <NotFound /> },
  { path: '/track-delivery/:id', element: <ProtectedRoute><TrackDelivery /></ProtectedRoute>, errorElement: <NotFound /> },
  { path: '*', element: <NotFound /> },
]);

export default router;