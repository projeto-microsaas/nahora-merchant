import React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeliveryStatus({ className, courierName, status, step = 3, statusText }) {
  return (
    <div className={cn("bg-zinc-900/90 text-white p-4 rounded-lg shadow-lg", "p-2 sm:p-4", className)}>
      {statusText ? (
        <div className="flex flex-col items-center mb-2">
          <p className="text-base font-medium"> {statusText}</p>
          <p className="text-sm text-zinc-400">{courierName} {status}</p>
        </div>
      ) : (
        <div className="flex items-center mb-2">
          <ChevronLeft className="h-5 w-5 mr-2" />
          <p className="text-base font-medium">{courierName} {status}</p>
        </div>
      )}
      
      <div className="flex justify-center mt-4 space-x-2">
        {[1, 2, 3, 4, 5].map((dotStep) => (
          <div 
            key={dotStep}
            className={cn(
              "w-2 h-2 rounded-full",
              "w-1.5 sm:w-2 h-1.5 sm:h-2", // Responsividade
              dotStep === step ? "bg-javai-purple" : "bg-gray-500"
            )}
          />
        ))}
      </div>
    </div>
  );
}