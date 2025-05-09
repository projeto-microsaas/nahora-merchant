// src/components/ui/badge.js
export function Badge({ className, children, ...props }) {
    return (
      <div
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
  
  export default Badge;