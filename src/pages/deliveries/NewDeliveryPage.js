import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/button";
import Input from "../../components/ui/input";
import api from "../../api/services/api.js";

const NewDeliveryPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    pickupAddress: "",
    deliveryAddress: "",
    packageDetails: "",
    deliveryInstructions: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await api.post("/api/deliveries", {
        customer: formData.customerName,
        phone: formData.customerPhone,
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        packageDetails: formData.packageDetails,
        instructions: formData.deliveryInstructions,
        status: "pending",
      });
      if (response.data && response.data.success) {
        navigate("/deliveries");
      } else {
        setError("Erro ao criar entrega: " + (response.data?.message || "Resposta inválida do servidor"));
      }
    } catch (err) {
      console.error("Erro ao criar entrega:", err);
      setError("Erro ao criar entrega. Tente novamente. Detalhes: " + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Nova Entrega</h1>
        <p className="text-muted-foreground mb-6">Preencha os detalhes para solicitar uma nova entrega.</p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Nome do Cliente</h2>
            <label htmlFor="customerName-input" className="block text-sm font-medium text-gray-700 mb-1">
              Nome completo
            </label>
            <Input
              id="customerName-input"
              name="customerName"
              type="text"
              placeholder="Nome completo"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="customerPhone-input" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone do Cliente
            </label>
            <Input
              id="customerPhone-input"
              name="customerPhone"
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              value={formData.customerPhone}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Endereço de Retirada</h2>
            <label htmlFor="pickupAddress-input" className="block text-sm font-medium text-gray-700 mb-1">
              Endereço completo para retirada
            </label>
            <Input
              id="pickupAddress-input"
              name="pickupAddress"
              type="text"
              placeholder="Endereço completo para retirada"
              value={formData.pickupAddress}
              onChange={handleChange}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">Este é o endereço onde o motoboy irá buscar o pacote.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Endereço de Entrega</h2>
            <label htmlFor="deliveryAddress-input" className="block text-sm font-medium text-gray-700 mb-1">
              Endereço completo para entrega
            </label>
            <Input
              id="deliveryAddress-input"
              name="deliveryAddress"
              type="text"
              placeholder="Endereço completo para entrega"
              value={formData.deliveryAddress}
              onChange={handleChange}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">Este é o endereço onde o pacote será entregue.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Detalhes do Pacote</h2>
            <label htmlFor="packageDetails-input" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo e tamanho do pacote
            </label>
            <Input
              id="packageDetails-input"
              name="packageDetails"
              type="text"
              placeholder="Tipo e tamanho do pacote"
              value={formData.packageDetails}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="deliveryInstructions-input" className="block text-sm font-medium text-gray-700 mb-1">
              Instruções de Entrega
            </label>
            <Input
              id="deliveryInstructions-input"
              name="deliveryInstructions"
              type="text"
              placeholder="Instruções adicionais para o entregador (opcional)"
              value={formData.deliveryInstructions}
              onChange={handleChange}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">Instruções adicionais para o entregador (opcional)</p>
          </div>
          <div className="flex space-x-4">
            <Button
              className="bg-javai-purple hover:bg-javai-purple-dark"
              onClick={handleSubmit}
            >
              Solicitar Entrega
            </Button>
            <Button
              className="bg-gray-500 hover:bg-gray-600"
              onClick={() => navigate("/deliveries")}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewDeliveryPage;