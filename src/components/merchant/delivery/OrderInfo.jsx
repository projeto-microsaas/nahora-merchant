import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../ui/form";
import styles from './OrderInfo.module.css';

const OrderInfo = () => {
  const { control, watch } = useFormContext();
  const products = watch('order.products') || [];
  const total = products.reduce((sum, p) => sum + (Number(p.price) * Number(p.quantity) || 0), 0);

  return (
    <div className={styles.container}>
      <div className={styles.total}>
        <FormLabel>Valor Total:</FormLabel>
        <FormControl>
          <input value={`R$${total.toFixed(2)}`} readOnly className={styles.totalInput} />
        </FormControl>
      </div>
      <FormField
        control={control}
        name="order.instructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instruções para o motorista</FormLabel>
            <FormControl>
              <textarea {...field} className={styles.instructions} placeholder="Digite instruções..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default OrderInfo;