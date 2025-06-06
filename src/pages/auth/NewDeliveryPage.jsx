import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NewDeliveryPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("https://api.example.com/api/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar nova entrega");
      }

      alert("Entrega criada com sucesso!");
      navigate("/dashboard"); // volta ao painel
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Nova Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="customer"
              placeholder="Nome do Cliente"
              value={formData.customer}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            <input
              name="address"
              placeholder="Endereço de Entrega"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            <Button
              type="submit"
              className="bg-javai-purple hover:bg-javai-purple-dark w-full"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Criar Entrega"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewDeliveryPage;
