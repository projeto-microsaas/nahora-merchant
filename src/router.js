import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NewDeliveryPage from "./pages/auth/NewDeliveryPage"; // Ajuste o caminho conforme necessário
import LoginPage from "./pages/auth/LoginPage"; // Ajuste o caminho conforme necessário

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/merchant/new-delivery", element: <NewDeliveryPage /> },
      { path: "/login", element: <LoginPage /> }, // Exemplo de rota de login
      // Adicione outras rotas conforme necessário
    ],
  },
]);

export default router;