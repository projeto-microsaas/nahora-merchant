import React from 'react';
import { BadgeDollarSign } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";

const DriverEarningsButton = () => {
  const [showEarnings, setShowEarnings] = useState(false);

  const handleCheckEarnings = () => {
    setShowEarnings(!showEarnings);
    toast.success("Faturamento do dia: R$ 120,00");
  };

  return (
    <div className="px-4 py-3">
      <Button 
        onClick={handleCheckEarnings}
        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm sm:text-base"
        size="lg"
      >
        <BadgeDollarSign color="#FF7300" className="mr-2 h-5 w-5" />
        Verificar Faturamento Diário
      </Button>
    </div>
  );
};

export default DriverEarningsButton;