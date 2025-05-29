import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

const DropdownMenuLabel = React.forwardRef(function DropdownMenuLabel(
    { className, inset, ...props },
    ref
) {
    return (
        <DropdownMenuPrimitive.Label
            ref={ref}
            className={cn(
                "px-2 py-1.5 text-sm font-semibold",
                inset && "pl-8",
                "py-1 sm:py-1.5 text-xs sm:text-sm", // Responsividade
                className
            )}
            {...props}
        />
    );
});
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

module.exports = { DropdownMenuLabel };