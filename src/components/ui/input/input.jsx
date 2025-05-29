import React from 'react';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={className}
      ref={ref} // Delega o ref ao elemento input
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };