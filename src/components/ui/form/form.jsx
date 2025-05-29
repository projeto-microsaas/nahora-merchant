import * as React from 'react';
import { Form as FormProvider, useFormContext, Controller } from 'react-hook-form';
import styles from './form.module.css';

export const Form = ({ children, ...props }) => (
  <FormProvider {...props}>
    <form className={styles.form}>{children}</form>
  </FormProvider>
);

export const FormField = ({ name, render, ...props }) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) =>
        render({ field, fieldState, ...props })
      }
    />
  );
};

export const FormItem = ({ children, className, ...props }) => (
  <div className={className} {...props}>{children}</div>
);

export const FormLabel = ({ children, className, ...props }) => (
  <label className={className} {...props}>{children}</label>
);

export const FormControl = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const FormMessage = ({ children, className, ...props }) => (
  <span className={className} {...props}>{children}</span>
);