import React from "react";
import { cn } from "@/lib/utils";
import { useFormField } from "./use-form-field";

const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", "text-xs sm:text-sm", className)} // Responsividade
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

export { FormDescription };