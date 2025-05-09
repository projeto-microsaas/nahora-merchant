// src/components/ui/table.js
export function Table({ className, ...props }) {
    return <div className="overflow-auto"><table className={`w-full caption-bottom text-sm ${className}`} {...props} /></div>;
  }
  
  export function TableHeader({ className, ...props }) {
    return <thead className={`bg-muted/50 ${className}`} {...props} />;
  }
  
  export function TableBody({ className, ...props }) {
    return <tbody className={className} {...props} />;
  }
  
  export function TableRow({ className, ...props }) {
    return <tr className={`border-b transition-colors hover:bg-muted/50 ${className}`} {...props} />;
  }
  
  export function TableHead({ className, ...props }) {
    return (
      <th className={`h-10 px-4 text-left align-middle font-medium text-muted-foreground ${className}`} {...props} />
    );
  }
  
  export function TableCell({ className, ...props }) {
    return <td className={`p-4 align-middle ${className}`} {...props} />;
  }
  
  export default { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };