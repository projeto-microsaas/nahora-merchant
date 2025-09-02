import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import styles from './ResidenceTypeSelector.module.css';

const ResidenceTypeSelector = () => {
  const { control, watch } = useFormContext();

  return (
    <div className={styles.container}>
      <FormField
        control={control}
        name="deliveryAddress.residenceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Residência</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={styles.select}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className={styles.dropdown}>
                  <SelectItem value="house">Casa</SelectItem>
                  <SelectItem value="apartment">Apartamento</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {watch('deliveryAddress.residenceType') === 'apartment' && (
        <FormField
          control={control}
          name="deliveryAddress.apartment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nº Apartamento</FormLabel>
              <FormControl>
                <input {...field} className={styles.apartmentInput} placeholder="Número do apartamento" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default ResidenceTypeSelector;

