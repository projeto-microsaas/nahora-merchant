import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import NotFound from "./NotFound";
import SettingsPage from "./SettingsPage";
import Profile from "./Profile";
import Orders from "./Orders";
import LoginPage from "./auth/LoginPage";
import DriverLoginPage from "./auth/DriverLoginPage";
import DriverRegisterPage from "./auth/DriverRegisterPage";
import DriverResetPasswordPage from "./auth/DriverResetPasswordPage";
import DeliveriesDashboard from "./deliveries/DeliveriesDashboard";
import DeliveriesPage from "./deliveries/DeliveriesPage";
import HistoryPage from "./deliveries/HistoryPage";
import NewDeliveryPage from "./deliveries/NewDeliveryPage";
import TrackDeliveryPage from "./deliveries/TrackDeliveryPage";
import DriverApp from "./driver/DriverApp";
import DriverTrackDeliveryPage from "./driver/DriverTrackDeliveryPage";
import App from "./merchant/MerchantApp";
import ActivityHistoryPage from "./merchant/ActivityHistoryPage";
import AddProductPage from "./merchant/AddProductPage";
import CategoriesPage from "./merchant/CategoriesPage";
import DeliveryDetailsPage from "./merchant/DeliveryDetailsPage";
import MerchantNewDeliveryPage from "./merchant/NewDeliveryPage";
import MerchantTrackDeliveryPage from "./merchant/TrackDeliveryPage";

const Index = () => {
  return (
    <Router>
      <Routes>
        {/* Páginas Gerais */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />

        {/* Autenticação */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/driver/login" element={<DriverLoginPage />} />
        <Route path="/driver/register" element={<DriverRegisterPage />} />
        <Route path="/driver/reset-password" element={<DriverResetPasswordPage />} />

        {/* Entregas */}
        <Route path="/deliveries/dashboard" element={<DeliveriesDashboard />} />
        <Route path="/deliveries" element={<DeliveriesPage />} />
        <Route path="/deliveries/history" element={<HistoryPage />} />
        <Route path="/deliveries/new" element={<NewDeliveryPage />} />
        <Route path="/deliveries/track/:deliveryId" element={<TrackDeliveryPage />} />

        {/* Motorista */}
        <Route path="/driver" element={<DriverApp />} />
        <Route path="/driver/track/:deliveryId" element={<DriverTrackDeliveryPage />} />

        {/* Lojista (Merchant) */}
        <Route path="/merchant" element={<App />} />
        <Route path="/merchant/activity-history" element={<ActivityHistoryPage />} />
        <Route path="/merchant/add-product" element={<AddProductPage />} />
        <Route path="/merchant/categories" element={<CategoriesPage />} />
        <Route path="/merchant/delivery/:deliveryId" element={<DeliveryDetailsPage />} />
        <Route path="/merchant/new-delivery" element={<MerchantNewDeliveryPage />} />
        <Route path="/merchant/track/:deliveryId" element={<MerchantTrackDeliveryPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default Index;