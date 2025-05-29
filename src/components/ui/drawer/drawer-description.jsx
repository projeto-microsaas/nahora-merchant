import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";

const DrawerDescription = React.forwardRef(function DrawerDescription(
    { className, ...props },
    ref
) {
    return (
        <DrawerPrimitive.Description
            ref={ref}
            className={cn(
                "text-sm text-muted-foreground",
                "text-xs sm:text-sm", // Responsividade
                className
            )}
            {...props}
        />
    );
});
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export { DrawerDescription };