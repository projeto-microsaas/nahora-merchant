import React from 'react';
import { X, FileText, HelpCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

const DeliveryHeader = ({ 
  className, 
  nomeEntregador, 
  onClose, 
  onReceiptClick, 
  onHelpClick, 
  isDriver = false 
}) => {
  return (
    <div className={cn("w-full px-4 py-3 flex items-center justify-between", className)}>
      <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <X className="h-5 w-5" />
      </button>
      
      <p className="font-medium text-sm sm:text-base truncate">
        {isDriver ? "Entrega em andamento" : `Entregador: ${nomeEntregador}`}
      </p>
      
      {!isDriver && (
        <div className="flex items-center gap-2 sm:gap-4">
          {onReceiptClick && (
            <button 
              onClick={onReceiptClick} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FileText className="h-5 w-5" />
            </button>
          )}
          {onHelpClick && (
            <button 
              onClick={onHelpClick} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
      
      {isDriver && <div className="w-10" />}
    </div>
  );
};

export default DeliveryHeader;