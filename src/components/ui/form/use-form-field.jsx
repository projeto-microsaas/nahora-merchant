import React from 'react';
import { useFormContext } from "react-hook-form";

// Crie e exporte o FormItemContext
export const FormItemContext = React.createContext({});

export const useFormField = () => {
  const fieldContext = React.useContext(FormItemContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, control } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, control);

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

export default useFormField;