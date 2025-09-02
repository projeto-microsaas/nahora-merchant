import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={className || 'fixed z-50 bg-white p-6 rounded-lg shadow-lg'}
    {...props}
  >
    {children}
  </DialogPrimitive.Content>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

export default DialogContent;