import React from 'react';
import { Home, Package, ShoppingBag, Settings } from "lucide-react";
import { cn } from "../../lib/utils";

const MerchantBottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'deliveries', label: 'Entregas', icon: Package },
    { id: 'products', label: 'Produtos', icon: ShoppingBag },
    { id: 'settings', label: 'Conta', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-background border-t border-zinc-800 h-14 sm:h-16 flex items-center justify-around">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={cn(
              "flex flex-col items-center justify-center h-full w-full",
              isActive ? "text-javai-orange" : "text-gray-400"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="h-5 w-5 mb-1" />
            <span className="text-xs sm:text-sm">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MerchantBottomNav;