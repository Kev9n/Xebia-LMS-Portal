import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "@/lib/utils";
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return _jsx("input", {
    type: type,
    className: cn(
      "flex h-10 w-full rounded-[var(--radius-soft)] border border-input bg-card px-3 py-2 text-sm font-normal shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow,transform] duration-150 ease-out file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_oklab,var(--accent)_28%,transparent)] focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className,
    ),
    ref: ref,
    ...props,
  });
});
Input.displayName = "Input";
export { Input };
