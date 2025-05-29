import React from "react";
import { X, FileText, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeliveryHeader({ 
  className, 
  courierName, 
  onClose, 
  onReceiptClick, 
  onHelpClick,
  isDriver = false 
}) {
  return (
    <div className={cn("w-full px-4 py-3 flex items-center justify-between", "px-2 sm:px-4 py-2 sm:py-3", className)}>
      <button onClick={onClose} className="p-2">
        <X className="h-5 w-5" />
      </button>
      
      <p className="font-medium text-xs sm:text-sm">
        {isDriver ? "Entrega em andamento" : `Entregador: ${courierName}`}
      </p>
      
      {!isDriver && (
        <div className="flex items-center gap-4">
          {onReceiptClick && (
            <button onClick={onReceiptClick}>
              <FileText className="h-5 w-5" />
            </button>
          )}
          {onHelpClick && (
            <button onClick={onHelpClick}>
              <HelpCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
      
      {isDriver && <div className="w-10" />} {/* Spacer for alignment */}
    </div>
  );
}