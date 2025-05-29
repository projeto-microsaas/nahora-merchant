import React from 'react';
import { useState } from "react";
import { Bike, Bell, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";

const DriverTabHeader = ({ activeTab, setActiveTab }) => {
  const driverName = "Carlos";
  const [selectedVehicle, setSelectedVehicle] = useState("Honda CG 160 • ABC-1234");
  
  const vehicles = [
    "Honda CG 160 • ABC-1234",
    "Yamaha Factor • DEF-5678",
    "Honda Biz • GHI-9012"
  ];

  return (
    <div className="bg-background sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/01946d57-cac1-41cb-aa37-6dfc57573074.png" 
            alt="NaHora Logo" 
            className="h-7" 
          />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <span className="text-sm font-medium truncate max-w-[150px] sm:max-w-[200px]">{selectedVehicle}</span>
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {vehicles.map((vehicle) => (
                <DropdownMenuItem 
                  key={vehicle} 
                  onClick={() => setSelectedVehicle(vehicle)}
                  className="cursor-pointer text-sm sm:text-base"
                >
                  {vehicle}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            6
          </span>
        </div>
      </div>
      
      <div className="px-4 py-4">
        <h2 className="text-xl font-bold text-sm sm:text-xl">Olá, {driverName}</h2>
        <div className="flex items-center mt-1">
          <span className="text-javai-orange text-sm sm:text-base font-medium">Ver meu desempenho</span>
          <ChevronDown className="h-4 w-4 text-javai-orange" />
        </div>
      </div>
    </div>
  );
};

export default DriverTabHeader;