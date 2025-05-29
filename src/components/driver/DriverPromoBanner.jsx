import React from 'react';
import { Bike } from "lucide-react";
import { Button } from "../ui/button";

const DriverPromoBanner = () => {
  return (
    <div className="p-4">
      <div className="bg-javai-purple/20 rounded-lg p-4 flex items-center justify-between relative overflow-hidden">
        <div className="z-10">
          <h3 className="text-lg font-bold mb-2 text-sm sm:text-base">Pronto para começar?</h3>
          <p className="mb-4 text-sm text-muted-foreground">Aceite um pedido e comece a ganhar.</p>
          <Button variant="default" className="bg-javai-purple text-white hover:bg-javai-purple/90 text-sm sm:text-base">
            Procurar entregas
          </Button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-50">
          <Bike className="h-24 w-24 sm:h-32 sm:w-32" />
        </div>
      </div>
    </div>
  );
};

export default DriverPromoBanner;