// src/components/ui/button.js
function Button({ className, variant = "default", size = "default", ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantStyles = {
    default: "bg-nahora-orange text-white hover:bg-nahora-orange/90",
    outline: "border border-input bg-transparent hover:bg-muted hover:text-accent-foreground",
    ghost: "hover:bg-muted hover:text-accent-foreground",
  };

  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6",
    icon: "h-10 w-10",
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...props} />
  );
}

export default Button;