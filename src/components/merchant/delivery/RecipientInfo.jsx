import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../../ui/input";

const RecipientInfo = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="recipientName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm sm:text-base">Nome do Destinatário</FormLabel>
            <FormControl>
              <Input placeholder="Nome completo" {...field} className="text-sm sm:text-base" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="recipientPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm sm:text-base">Telefone do Destinatário</FormLabel>
            <FormControl>
              <Input placeholder="(XX) XXXXX-XXXX" {...field} className="text-sm sm:text-base" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RecipientInfo;