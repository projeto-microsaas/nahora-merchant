import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import React from 'react';
import { Input } from "../../ui/input";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { MapPin } from "lucide-react";

const AddressFields = ({ form, type, title }) => {
  const prefix = type === 'pickup' ? 'pickup' : 'delivery';

  return (
    <div className="space-y-4">
      <h3 className="text-sm sm:text-base font-medium flex items-center gap-2">
        <MapPin className="h-4 w-4 text-javai-orange" />
        {title}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`${prefix}StreetType`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Tipo</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Rua">Rua</SelectItem>
                  <SelectItem value="Avenida">Avenida</SelectItem>
                  <SelectItem value="Praça">Praça</SelectItem>
                  <SelectItem value="Alameda">Alameda</SelectItem>
                  <SelectItem value="Travessa">Travessa</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="col-span-1 sm:col-span-2">
          <FormField
            control={form.control}
            name={`${prefix}Street`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Logradouro</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da rua" {...field} className="text-sm sm:text-base" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`${prefix}Number`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Número</FormLabel>
              <FormControl>
                <Input placeholder="123" {...field} className="text-sm sm:text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="col-span-1 sm:col-span-2">
          <FormField
            control={form.control}
            name={`${prefix}Neighborhood`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Bairro</FormLabel>
                <FormControl>
                  <Input placeholder="Bairro" {...field} className="text-sm sm:text-base" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressFields;