import React from 'react';
import { useEffect } from "react";

const DriverLoadingScreen = ({
  message = "Carregando...",
  showUntilComplete = false,
  onComplete
}) => {
  useEffect(() => {
    if (!showUntilComplete && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [onComplete, showUntilComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background animate-fade-in">
      <div className="w-full max-w-md flex flex-col items-center space-y-8 px-4">
        <div className="flex justify-center items-center mb-4 relative">
          <img 
            src="/lovable-uploads/8e795fa3-2820-4b39-8e59-770e2112de7a.png" 
            alt="Entregador de moto"
            className="h-32 w-auto animate-pulse sm:h-40"
          />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{message}</h2>
        <p className="text-muted-foreground text-sm mt-2 sm:text-base">
          Preparando suas entregas...
        </p>
      </div>
    </div>
  );
};

export default DriverLoadingScreen;