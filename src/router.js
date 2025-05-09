import { createBrowserRouter } from "react-router-dom";
import DeliveriesDashboard from "./pages/deliveries/DeliveriesDashboard";
import DeliveriesPage from "./pages/deliveries/DeliveriesPage";
import NewDeliveryPage from "./pages/deliveries/NewDeliveryPage";
import HistoryPage from "./pages/deliveries/HistoryPage";
import LoginPage from "./pages/auth/LoginPage";
import MerchantApp from "./pages/merchant/MerchantApp";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/deliveries/dashboard", element: <DeliveriesDashboard /> },
  { path: "/deliveries", element: <DeliveriesPage /> },
  { path: "/new-delivery", element: <NewDeliveryPage /> },
  { path: "/deliveries/history", element: <HistoryPage /> },
  { path: "/merchant", element: <MerchantApp /> },
  { path: "*", element: <div className="p-4 text-center text-white">Página não encontrada (404)</div> },
]);

export default router;