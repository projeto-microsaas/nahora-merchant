import * as React from "react";
import { cn } from "@/lib/utils";

const DropdownMenuShortcut = ({
  className,
  ...props
}) => (
  <span
    className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
    {...props}
  />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export { DropdownMenuShortcut };