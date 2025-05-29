import React from 'react';
import { Bike, Calendar, List, Package } from "lucide-react";

const DriverQuickActions = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3 text-sm sm:text-base">Sugestões</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-800 rounded-lg p-3 flex flex-col items-center">
          <div className="bg-zinc-700 p-2 rounded-full mb-2">
            <Bike color="#FF7300" className="h-6 w-6" />
          </div>
          <span className="text-sm">Entregas</span>
        </div>
        <div className="bg-zinc-800 rounded-lg p-3 flex flex-col items-center">
          <div className="bg-zinc-700 p-2 rounded-full mb-2">
            <Calendar color="#FF7300" className="h-6 w-6" />
          </div>
          <span className="text-sm">Agenda</span>
        </div>
        <div className="bg-zinc-800 rounded-lg p-3 flex flex-col items-center">
          <div className="bg-zinc-700 p-2 rounded-full mb-2">
            <List color="#FF7300" className="h-6 w-6" />
          </div>
          <span className="text-sm">Histórico</span>
        </div>
        <div className="bg-zinc-800 rounded-lg p-3 flex flex-col items-center">
          <div className="bg-zinc-700 p-2 rounded-full mb-2">
            <Package color="#FF7300" className="h-6 w-6" />
          </div>
          <span className="text-sm">Pedidos</span>
        </div>
      </div>
    </div>
  );
};

export default DriverQuickActions;