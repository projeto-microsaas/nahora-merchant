import React from 'react';
import { Loader2 } from "lucide-react";

const DriverSearching = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 className="h-8 w-8 animate-spin text-javai-orange mb-2" />
      <p className="text-sm sm:text-base text-center">Buscando motorista disponível...</p>
    </div>
  );
};

export default DriverSearching;