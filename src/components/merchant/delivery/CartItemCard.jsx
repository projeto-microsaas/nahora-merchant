import React from 'react';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { X } from "lucide-react";

const CartItemCard = ({ 
  item, 
  onUpdateQuantity, 
  onUpdateObservations, 
  onRemoveItem 
}) => {
  return (
    <div className="border rounded-md p-3 sm:p-4">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-2 sm:gap-0">
        <div>
          <h4 className="font-medium text-sm sm:text-base">{item.name}</h4>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            className="h-8 w-8 p-0 text-sm sm:text-base"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <span>-</span>
          </Button>
          <span className="w-8 text-center text-sm sm:text-base">{item.quantity}</span>
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            className="h-8 w-8 p-0 text-sm sm:text-base"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <span>+</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 ml-2 text-sm sm:text-base"
            onClick={() => onRemoveItem(item.id)}
          >
            <X className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      
      <div className="mt-2">
        <Input 
          placeholder="Observações do item (opcional)" 
          value={item.observations || ""}
          onChange={(e) => onUpdateObservations(item.id, e.target.value)}
          className="text-sm sm:text-base"
        />
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <Badge variant="outline" className="text-xs sm:text-sm">{item.category}</Badge>
        <span className="text-javai-orange font-medium text-sm sm:text-base">
          {`R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}`}
        </span>
      </div>
    </div>
  );
};

export default CartItemCard;