import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { MapPin } from 'lucide-react';
import styles from './AddressFields.module.css';

const AddressFields = ({ type }) => {
  const { control } = useFormContext();
  const prefix = type === 'pickup' ? 'pickupAddress' : 'deliveryAddress';

  return (
    <div className={styles.container}>
      <div className={styles.labelContainer}>
        <MapPin className={styles.icon} />
        <span>{type === 'pickup' ? 'Endereço de Retirada' : 'Endereço de Entrega'}</span>
      </div>
      <FormField
        control={control}
        name={`${prefix}.type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className={styles.select}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className={styles.dropdown}>
                <SelectItem value="Rua">Rua</SelectItem>
                <SelectItem value="Avenida">Avenida</SelectItem>
                <SelectItem value="Praça">Praça</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}.street`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logradouro</FormLabel>
            <FormControl>
              <Input {...field} className={styles.input} placeholder="Logradouro" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className={styles.inputGroup}>
        <FormField
          control={control}
          name={`${prefix}.number`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input {...field} className={styles.input} placeholder="Número" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}.neighborhood`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input {...field} className={styles.input} placeholder="Bairro" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AddressFields;