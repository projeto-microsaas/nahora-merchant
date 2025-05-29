import React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaginationLink } from "./pagination-link";

const PaginationPrevious = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

export { PaginationPrevious };