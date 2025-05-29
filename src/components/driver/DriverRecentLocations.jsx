import React from 'react';
import { Clock, MapPin } from "lucide-react";

const DriverRecentLocations = () => {
  return (
    <div className="px-4 py-2">
      <div className="bg-zinc-800 rounded-lg p-4 mb-3 flex items-center justify-between">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 mt-1 text-zinc-400" />
          <div>
            <p className="font-medium text-sm sm:text-base">Shopping Iguatemi</p>
            <p className="text-zinc-400 text-sm">Av. Brigadeiro Faria Lima, 2232</p>
          </div>
        </div>
        <div className="text-zinc-400">
          <Clock className="h-5 w-5" />
        </div>
      </div>
      
      <div className="bg-zinc-800 rounded-lg p-4 mb-3 flex items-center justify-between">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 mt-1 text-zinc-400" />
          <div>
            <p className="font-medium text-sm sm:text-base">Mercado São Paulo</p>
            <p className="text-zinc-400 text-sm">Rua Augusta, 1508</p>
          </div>
        </div>
        <div className="text-zinc-400">
          <Clock className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default DriverRecentLocations;