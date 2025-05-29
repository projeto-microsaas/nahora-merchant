import React from 'react';
import { cn } from '../../lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';

const DialogTitle = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn("text-lg font-semibold", className)}
      {...rest}
    />
  );
});
export default DialogTitle;