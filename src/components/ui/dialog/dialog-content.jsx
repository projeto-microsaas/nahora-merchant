const DialogContent = React.forwardRef((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Content
        ref={ref}
        className={cn("...", className)}
        {...rest}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
export default DialogContent;