import React from 'react';
import { cn } from "../../lib/utils";
import { toast } from "sonner";

const DriverStatus = {
  AVAILABLE: "available",
  BUSY: "busy",
  OFFLINE: "offline"
};

const DriverStatusSelector = ({ driverStatus, setDriverStatus }) => {
  const handleStatusChange = (status) => {
    setDriverStatus(status);
    toast.success(`Status alterado para ${status === DriverStatus.AVAILABLE ? 'Disponível' : status === DriverStatus.BUSY ? 'Ocupado' : 'Offline'}`);
  };

  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn(
          "h-3 w-3 rounded-full",
          driverStatus === DriverStatus.AVAILABLE ? "bg-green-500" :
          driverStatus === DriverStatus.BUSY ? "bg-orange-500" : "bg-red-500"
        )} />
        <span className="font-medium text-sm sm:text-base">
          {driverStatus === DriverStatus.AVAILABLE ? "Disponível" :
           driverStatus === DriverStatus.BUSY ? "Ocupado" : "Offline"}
        </span>
      </div>
      <div className="flex gap-2">
        <button 
          className={cn(
            "px-3 py-1 rounded-full text-sm sm:text-base",
            driverStatus === DriverStatus.AVAILABLE 
              ? "bg-green-500 text-white" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          )}
          onClick={() => handleStatusChange(DriverStatus.AVAILABLE)}
        >
          Online
        </button>
        <button 
          className={cn(
            "px-3 py-1 rounded-full text-sm sm:text-base",
            driverStatus === DriverStatus.OFFLINE 
              ? "bg-red-500 text-white" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          )}
          onClick={() => handleStatusChange(DriverStatus.OFFLINE)}
        >
          Offline
        </button>
      </div>
    </div>
  );
};

export default DriverStatusSelector;