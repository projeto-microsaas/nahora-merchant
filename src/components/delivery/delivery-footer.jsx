import React from "react";
import { FileText, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeliveryFooter({ className, onOverviewClick, onShareClick }) {
  return (
    <div className={cn("w-full px-4 py-3 flex justify-between", "px-2 sm:px-4 py-2 sm:py-3", className)}>
      <button 
        onClick={onOverviewClick}
        className="flex items-center justify-center bg-zinc-800/80 text-white px-6 py-2 rounded-full"
      >
        <FileText className="h-4 w-4 mr-2" />
        <span className="text-xs sm:text-sm">Detalhes</span>
      </button>
      
      <button 
        onClick={onShareClick}
        className="flex items-center justify-center bg-zinc-800/80 text-white p-2 rounded-full"
      >
        <Share2 className="h-5 w-5" />
      </button>
    </div>
  );
}