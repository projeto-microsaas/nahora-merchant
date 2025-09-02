import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

const Switch = React.forwardRef(({ checked, onCheckedChange, ...props }, ref) => (
  <SwitchPrimitives.Root
    checked={checked}
    onCheckedChange={onCheckedChange}
    ref={ref}
    {...props}
  >
    <SwitchPrimitives.Thumb />
  </SwitchPrimitives.Root>
));
Switch.displayName = "Switch";

export { Switch };