import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCarousel } from "./carousel-context";

/**
 * @typedef {Object} ButtonProps
 * @property {string} [variant]
 * @property {string} [size]
 * @property {string} [className]
 * @property {boolean} [disabled]
 * @property {() => void} [onClick]
 * @property {React.ReactNode} [children]
 */
// No type definitions are needed in JSX files, so this section can be removed.
const CarouselNext = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2 sm:-right-12"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90 sm:-bottom-12",
          "h-7 w-7 sm:h-8 sm:w-8", // Responsividade
          className
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  }
);
CarouselNext.displayName = "CarouselNext";

export { CarouselNext };