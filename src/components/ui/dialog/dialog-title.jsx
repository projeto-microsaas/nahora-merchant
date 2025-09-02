import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={className || "text-lg font-semibold leading-none tracking-tight"}
    {...props}
  />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

export default DialogTitle;