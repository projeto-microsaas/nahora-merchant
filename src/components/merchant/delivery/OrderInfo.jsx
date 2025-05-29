import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../../ui/input";

const OrderInfo = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="orderTotal"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm sm:text-base">Total do Pedido</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || "0,00"}
                readOnly
                className="text-sm sm:text-base"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="deliveryInstructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm sm:text-base">Instruções de Entrega (opcional)</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Ex: Deixar na portaria"
                className="text-sm sm:text-base"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default OrderInfo;