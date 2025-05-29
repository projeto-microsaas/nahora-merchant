// src/components/ui/form/form-field.jsx
import * as React from "react";
import { useFormField } from "./use-form-field";

const FormField = ({ control, name, render }) => {
  const fieldProps = useFormField();
  return render({ field: { ...fieldProps, control, name } });
};

export { FormField };