import React from 'react';
import { useState, useEffect } from "react";
import { MerchantDeliveryCard } from "./MerchantDeliveryCard";
import axios from "axios";

const MerchantDeliveriesScreen = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token de autenticação não encontrado");

        const response = await axios.get("http://localhost:5000/api/deliveries", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeliveries(response.data);
      } catch (error) {
        console.error("Erro ao carregar entregas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Entregas</h1>
      {deliveries.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma entrega encontrada.</p>
      ) : (
        <div className="space-y-3">
          {deliveries.map((delivery) => (
            <MerchantDeliveryCard key={delivery._id} {...delivery} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchantDeliveriesScreen;