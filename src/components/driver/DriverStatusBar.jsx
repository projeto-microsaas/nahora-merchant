import React from 'react';
import { Circle, Power } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const DriverStatusBar = () => {
  const [isOnline, setIsOnline] = useState(false);

  const toggleStatus = () => {
    setIsOnline(!isOnline);
    // TODO: Implement API call to update driver status
  };

  return (
    <div className="flex justify-end items-center px-4 py-2 border-b border-zinc-800">
      <div className="flex items-center gap-2">
        <span className="text-sm sm:text-base">
          {isOnline ? 'Online' : 'Offline'}
        </span>
        <Circle 
          className={`h-3 sm:h-4 w-3 sm:w-4 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} 
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleStatus}
          className="text-xs sm:text-sm flex items-center gap-1"
        >
          <Power className="h-4 w-4" />
          {isOnline ? 'Desativar' : 'Ativar'}
        </Button>
      </div>
    </div>
  );
};

export default DriverStatusBar;