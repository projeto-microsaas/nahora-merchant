// src/components/ui/form/form-item.jsx
import * as React from "react";
import { FormItemContext } from "./use-form-field";
import { cn } from "@/lib/utils";

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id, ...props }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

export { FormItem };