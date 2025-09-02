import React from 'react';
const DialogOverlay = React.forwardRef((props, ref) => {
    const { className, ...rest } = props;
    return (
      <DialogPrimitive.Overlay
        ref={ref}
        className={cn("...", className)}
        {...rest}
      />
    );
  });
  export default DialogOverlay;