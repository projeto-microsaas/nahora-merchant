import React from 'react';
import { useState } from "react";
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from 'react';
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MerchantDeliveryForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer: "",
    address: "",
    items: "",
    total: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token de autenticação não encontrado");

      await axios.post(
        "http://localhost:5000/api/deliveries",
        {
          customer: formData.customer,
          address: formData.address,
          items: formData.items,
          total: parseFloat(formData.total),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Entrega solicitada com sucesso!");
      navigate("/merchant");
    } catch (error) {
      toast.error("Erro ao solicitar entrega: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Nome do Cliente *</Label>
            <Input
              id="customer"
              name="customer"
              placeholder="Ex: João Silva"
              value={formData.customer}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço de Entrega *</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Ex: Rua das Flores, 123, Centro"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="items">Itens do Pedido *</Label>
            <Textarea
              id="items"
              name="items"
              placeholder="Ex: Hambúrguer:1;Refrigerante:2"
              value={formData.items}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="total">Total (R$) *</Label>
            <Input
              id="total"
              name="total"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 50.00"
              value={formData.total}
              onChange={handleInputChange}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full bg-javai-orange hover:bg-javai-orange/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Solicitando..." : "Solicitar Entrega"}
      </Button>
    </form>
  );
};

export default MerchantDeliveryForm;