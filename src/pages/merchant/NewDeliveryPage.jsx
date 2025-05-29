import { MerchantTabHeader } from "@/components/merchant/MerchantTabHeader";
import { MerchantDeliveryForm } from "@/components/merchant/MerchantDeliveryForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NewDeliveryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-background">
      <MerchantTabHeader />
      <div className="flex-1 overflow-auto pb-16 p-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/merchant")} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Nova Entrega</h1>
        </div>

        <p className="text-muted-foreground mb-6">
          Preencha os dados abaixo e adicione itens vendidos para solicitar uma nova entrega
        </p>

        <MerchantDeliveryForm />
      </div>
    </div>
  );
};

export default NewDeliveryPage;