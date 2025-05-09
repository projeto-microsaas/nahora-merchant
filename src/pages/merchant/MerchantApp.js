import { useState } from "react";
import MerchantTabHeader from "../../components/merchant/MerchantTabHeader";
import MerchantBottomNav from "../../components/merchant/MerchantBottomNav";
import MerchantHomeScreen from "./MerchantHomeScreen";

const MerchantApp = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <MerchantHomeScreen />;
      case "products":
        return <div className="p-4">Tela de Produtos (em desenvolvimento)</div>;
      case "orders":
        return <div className="p-4">Tela de Pedidos (em desenvolvimento)</div>;
      case "profile":
        return <div className="p-4">Tela de Perfil (em desenvolvimento)</div>;
      default:
        return <MerchantHomeScreen />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <MerchantTabHeader storeName="Minha Loja" />
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      <MerchantBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default MerchantApp;