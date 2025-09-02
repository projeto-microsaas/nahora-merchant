import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../ui/form";
import { User, Phone } from 'lucide-react';
import styles from './RecipientInfo.module.css';

const RecipientInfo = () => {
  const { control } = useFormContext();

  return (
    <div className={styles.container}>
      <FormField
        control={control}
        name="recipient.name"
        render={({ field }) => (
          <FormItem className={styles.field}>
            <div className={styles.labelContainer}>
              <User className={styles.icon} />
              <FormLabel>Nome</FormLabel>
            </div>
            <FormControl>
              <input {...field} className={styles.input} placeholder="Nome" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="recipient.phone"
        render={({ field }) => (
          <FormItem className={styles.field}>
            <div className={styles.labelContainer}>
              <Phone className={styles.icon} />
              <FormLabel>Telefone</FormLabel>
            </div>
            <FormControl>
              <input {...field} className={styles.input} placeholder="Telefone" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RecipientInfo;