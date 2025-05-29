import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DeliveryMap } from "@/components/delivery/DeliveryMap";
import { DeliveryStatus } from "@/components/delivery/DeliveryStatus";
import { DeliveryHeader } from "@/components/delivery/DeliveryHeader";
import { DeliveryFooter } from "@/components/delivery/DeliveryFooter";
import ChatDialog from '@/components/chat/ChatDialog';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Car } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const TrackDeliveryPage = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const [deliveryData, setDeliveryData] = useState(null);

  useEffect(() => {
    const loadDelivery = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token de autenticação não encontrado");

        const response = await axios.get(`http://localhost:5000/api/deliveries/${deliveryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeliveryData({
          id: response.data._id,
          courierName: response.data.driver?.name || "Desconhecido",
          courierPhoto: "https://i.pravatar.cc/100",
          vehicleModel: response.data.driver?.vehicle || "Não informado",
          vehiclePlate: "ABC1D23",
          status: getStatusText(response.data.status),
          step: getStep(response.data.status),
          customerName: response.data.customer,
          customerAddress: response.data.address,
          estimatedTime: "25 min",
          statusText: {
            1: "Motoboy aceitou",
            2: "A caminho do restaurante",
            3: "Pedido retirado",
            4: "Entregue ao cliente",
            5: "Entrega cancelada",
          },
        });

        if (response.data.status === "accepted") {
          toast(
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/100" />
                <AvatarFallback>{response.data.driver?.name?.[0] || "M"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{response.data.driver?.name || "Motoboy"} aceitou sua entrega</p>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Car className="h-4 w-4 mr-1" />
                  <span>{response.data.driver?.vehicle || "Não informado"} • ABC1D23</span>
                </div>
              </div>
            </div>,
            { duration: 5000 }
          );
        }
      } catch (error) {
        toast.error("Erro ao carregar rastreamento: " + error.message);
      }
    };

    if (deliveryId) loadDelivery();
  }, [deliveryId]);

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Aguardando aceitação";
      case "accepted":
        return "A caminho do restaurante";
      case "picked":
        return "A caminho do cliente";
      case "delivered":
        return "Entregue ao cliente";
      case "canceled":
        return "Entrega cancelada";
      default:
        return "Status desconhecido";
    }
  };

  const getStep = (status) => {
    switch (status) {
      case "pending":
        return 1;
      case "accepted":
        return 2;
      case "picked":
        return 3;
      case "delivered":
        return 4;
      case "canceled":
        return 5;
      default:
        return 1;
    }
  };

  const handleClose = () => navigate(-1);
  const handleReceiptClick = () => toast.info("Nota fiscal disponível no email");
  const handleHelpClick = () => toast.info("Ajuda disponível no chat");
  const handleOverviewClick = () => toast.info(`Entrega para ${deliveryData?.customerName}. Tempo estimado: ${deliveryData?.estimatedTime}`);
  const handleShareClick = () =>
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success("Link copiado para a área de transferência"))
      .catch(() => toast.error("Erro ao copiar link"));

  if (!deliveryData) return <div>Carregando...</div>;

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white overflow-hidden">
      <DeliveryHeader
        courierName={deliveryData.courierName}
        onClose={handleClose}
        onReceiptClick={handleReceiptClick}
        onHelpClick={handleHelpClick}
      />

      <div className="flex-1 relative">
        <DeliveryMap className="w-full h-full" />
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md">
          <DeliveryStatus
            courierName={deliveryData.courierName}
            status={deliveryData.status}
            step={deliveryData.step}
            statusText={deliveryData.statusText[deliveryData.step]}
          />

          <Alert className="mt-4 bg-zinc-900/90 border-zinc-700">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={deliveryData.courierPhoto} />
                <AvatarFallback>{deliveryData.courierName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <AlertTitle>{deliveryData.courierName}</AlertTitle>
                <AlertDescription className="flex items-center mt-1">
                  <Car className="h-4 w-4 mr-1" />
                  <span>{deliveryData.vehicleModel} • {deliveryData.vehiclePlate}</span>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </div>

        <div className="absolute bottom-24 right-4">
          <ChatDialog recipientName={deliveryData.courierName} />
        </div>
      </div>

      <div className="bg-zinc-900 px-4 py-3 border-t border-zinc-800">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{deliveryData.customerName}</h3>
            <p className="text-sm text-zinc-400">{deliveryData.customerAddress}</p>
          </div>
        </div>
      </div>

      <DeliveryFooter onOverviewClick={handleOverviewClick} onShareClick={handleShareClick} />
    </div>
  );
};

export default TrackDeliveryPage;