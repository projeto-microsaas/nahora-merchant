import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const ResidenceTypeSelector = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="deliveryType"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm sm:text-base">Tipo de Residência</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="house">Casa</SelectItem>
              <SelectItem value="apartment">Apartamento</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ResidenceTypeSelector;