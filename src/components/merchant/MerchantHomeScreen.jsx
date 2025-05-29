import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import styles from "./MerchantHomeScreen.module.css";

const MerchantHomeScreen = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ stats: {}, deliveries: [] });

  const fetchData = async () => {
    try {
      const [statsResponse, deliveriesResponse] = await Promise.all([
        axios.get("/api/stats"),
        axios.get("/api/deliveries/active"),
      ]);
      setData({
        stats: statsResponse.data,
        deliveries: deliveriesResponse.data,
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error.response?.data || error.message, "Status:", error.response?.status);
      if (error.response?.status === 403 || error.response?.status === 401) {
        console.log("Token inválido ou expirado, redirecionando para login...");
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Token no MerchantHomeScreen:", token);
    console.log("URL atual ao carregar MerchantHomeScreen:", window.location.pathname);

    if (!token) {
      console.log("Token ausente, redirecionando para login...");
      navigate("/login");
      return;
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  console.log("Estilos carregados:", styles);

  return (
    <div>
      <h1 className={styles?.title || ""}>Dashboard</h1>
      <div>
        <h2>Estatísticas</h2>
        {data.stats ? (
          <pre>{JSON.stringify(data.stats, null, 2)}</pre>
        ) : (
          <p>Carregando estatísticas...</p>
        )}
        <h2>Entregas Ativas</h2>
        {data.deliveries ? (
          <pre>{JSON.stringify(data.deliveries, null, 2)}</pre>
        ) : (
          <p>Carregando entregas...</p>
        )}
      </div>
    </div>
  );
};

export default MerchantHomeScreen;