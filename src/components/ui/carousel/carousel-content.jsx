import * as React from "react";
import { cn } from "@/lib/utils";
import { useCarousel } from "./carousel-context";

const CarouselContent = React.forwardRef(function CarouselContent({ className, ...props }, ref) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          orientation === "horizontal" ? "-ml-2 sm:-ml-4" : "-mt-2 sm:-mt-4", // Responsividade
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

export { CarouselContent };