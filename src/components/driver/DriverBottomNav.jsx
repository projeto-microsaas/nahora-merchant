import React from 'react';
import { Home, List, Package, User } from "lucide-react";
import { cn } from "../../lib/utils";

const DriverBottomNav = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-zinc-900 border-t border-zinc-800 flex justify-around py-3">
      <button 
        className={cn("flex flex-col items-center", activeTab === 'home' ? "text-white" : "text-zinc-500")}
        onClick={() => setActiveTab('home')}
      >
        <Home color="#FF7300" className="h-6 w-6" />
        <span className="text-xs sm:text-sm mt-1">Início</span>
      </button>
      <button 
        className={cn("flex flex-col items-center", activeTab === 'deliveries' ? "text-white" : "text-zinc-500")}
        onClick={() => setActiveTab('deliveries')}
      >
        <Package color="#FF7300" className="h-6 w-6" />
        <span className="text-xs sm:text-sm mt-1">Pedidos</span>
      </button>
      <button 
        className={cn("flex flex-col items-center", activeTab === 'activity' ? "text-white" : "text-zinc-500")}
        onClick={() => setActiveTab('activity')}
      >
        <List color="#FF7300" className="h-6 w-6" />
        <span className="text-xs sm:text-sm mt-1">Atividade</span>
      </button>
      <button 
        className={cn("flex flex-col items-center", activeTab === 'account' ? "text-white" : "text-zinc-500")}
        onClick={() => setActiveTab('account')}
      >
        <User color="#FF7300" className="h-6 w-6" />
        <span className="text-xs sm:text-sm mt-1">Conta</span>
      </button>
    </div>
  );
};

export default DriverBottomNav;