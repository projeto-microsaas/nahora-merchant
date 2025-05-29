import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";
import { DrawerOverlay } from "./drawer-overlay";

const DrawerContent = React.forwardRef(function DrawerContent(
    { className, children, ...props },
    ref
) {
    return (
        <DrawerPrimitive.Portal>
            <DrawerOverlay />
            <DrawerPrimitive.Content
                ref={ref}
                className={cn(
                    "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
                    "max-h-[80vh] sm:max-h-[70vh]", // Responsividade
                    className
                )}
                {...props}
            >
                <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
                {children}
            </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
    );
});
DrawerContent.displayName = "DrawerContent";

export { DrawerContent };