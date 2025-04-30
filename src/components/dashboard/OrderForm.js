import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "../ui/sonner";
import { createOrder } from "../../api/api";

const OrderForm = ({ drivers, onOrderCreated }) => {
  const [description, setDescription] = useState("");
  const [driverId, setDriverId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createOrder({ description, driverId, status: "pending" });
      toast.success("Pedido criado com sucesso!");
      onOrderCreated(response.data);
      setDescription("");
      setDriverId("");
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
      toast.error("Erro ao criar pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Criar Novo Pedido</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição do Pedido
          </label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="driver" className="block text-sm font-medium text-gray-700">
            Motorista
          </label>
          <select
            id="driver"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Selecione um motorista</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar Pedido"}
        </Button>
      </form>
    </div>
  );
};

export default OrderForm;