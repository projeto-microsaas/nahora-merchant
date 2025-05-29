import React from 'react';
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

const DeliveryConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  formData,
  cartItems,
}) => {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Nova Entrega</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-sm sm:text-base">Endereço de Retirada</h4>
              <p className="text-sm text-muted-foreground">
                {formData.pickupStreetType} {formData.pickupStreet}, {formData.pickupNumber} - {formData.pickupNeighborhood}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-sm sm:text-base">Endereço de Entrega</h4>
              <p className="text-sm text-muted-foreground">
                {formData.deliveryStreetType} {formData.deliveryStreet}, {formData.deliveryNumber} - {formData.deliveryNeighborhood}
                {formData.deliveryType === 'apartment' && `, Condomínio ${formData.deliveryBuildingNumber}, Apto ${formData.deliveryAptNumber}`}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-sm sm:text-base">Destinatário</h4>
              <p className="text-sm text-muted-foreground">
                {formData.recipientName} - {formData.recipientPhone}
              </p>
              {formData.deliveryInstructions && (
                <p className="text-sm text-muted-foreground mt-1">
                  Instruções: {formData.deliveryInstructions}
                </p>
              )}
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-sm sm:text-base">Itens do Pedido</h4>
              <div className="space-y-2">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm sm:text-base">
                    <span>{item.quantity}× {item.name}</span>
                    <span className="text-muted-foreground">{`R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}`}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium text-sm sm:text-base">
                <span>Total do Pedido</span>
                <span>{`R$ ${totalAmount.toFixed(2).replace(".", ",")}`}</span>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="text-sm sm:text-base">
            Voltar
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-javai-orange hover:bg-javai-orange/90 text-sm sm:text-base"
          >
            Confirmar e Procurar Motorista
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryConfirmationDialog;