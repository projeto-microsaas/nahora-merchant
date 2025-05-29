import React from 'react';
import { FileText, Share2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

const DeliveryFooter = ({ className, onOverviewClick, onShareClick }) => {
  return (
    <div className={cn("w-full px-4 py-3 flex justify-between items-center", className)}>
      <button 
        onClick={onOverviewClick}
        className="flex items-center justify-center bg-zinc-800/80 text-white px-4 py-2 rounded-full text-sm sm:text-base hover:bg-zinc-800 transition-colors"
      >
        <FileText className="h-4 w-4 mr-2" />
        <span>Detalhes</span>
      </button>
      
      <button 
        onClick={onShareClick}
        className="flex items-center justify-center bg-zinc-800/80 text-white p-2 rounded-full hover:bg-zinc-800 transition-colors sm:p-3"
      >
        <Share2 className="h-5 w-5" />
      </button>
    </div>
  );
};

export default DeliveryFooter;