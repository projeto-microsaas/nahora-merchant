// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MerchantHomeScreen from "./pages/merchant/MerchantHomeScreen";
import DeliveriesPage from "./pages/deliveries/DeliveriesPage";
import DeliveriesDashboard from "./pages/deliveries/DeliveriesDashboard";
import MerchantDeliveriesScreen from "./components/merchant/MerchantDeliveriesScreen";
import HistoryPage from "./pages/deliveries/HistoryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/merchant" />} />
        <Route path="/merchant" element={<MerchantHomeScreen />} />
        <Route path="/deliveries" element={<DeliveriesPage />} />
        <Route path="/deliveries/dashboard" element={<DeliveriesDashboard />} />
        <Route path="/merchant/deliveries" element={<MerchantDeliveriesScreen />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;