import React from 'react';
import { Button } from "../../ui/button";
import { Dialog, DialogContentComponent as DialogContent, DialogTitleComponent as DialogTitle } from "../../ui/dialog";
import { Separator } from "../../ui/separator";
import styles from './DeliveryConfirmationDialog.module.css';

const DeliveryConfirmationDialog = ({ open, onClose, onConfirm, data }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={styles.container}>
        <DialogTitle className={styles.title}>Confirmar Solicitação</DialogTitle>
        <div className={styles.content}>
          <p>Endereço de Retirada: {data?.pickupAddress?.street}, {data?.pickupAddress?.number}</p>
          <p>Endereço de Entrega: {data?.deliveryAddress?.street}, {data?.deliveryAddress?.number}</p>
          <p>Destinatário: {data?.recipient?.name}</p>
          <p>Valor Total: R${data?.order?.total}</p>
        </div>
        <Separator />
        <div className={styles.footer}>
          <Button variant="outline" className={styles.cancelButton} onClick={onClose}>Cancelar</Button>
          <Button className={styles.confirmButton} onClick={onConfirm}>Confirmar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryConfirmationDialog;