import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "@/lib/utils";
const Card = React.forwardRef(({ className, ...props }, ref) =>
  _jsx("div", {
    ref: ref,
    className: cn(
      "x-card rounded-[var(--radius-soft)] border bg-card text-card-foreground p-0 shadow-[0_16px_30px_-20px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-1 hover:shadow-[0_20px_45px_-24px_rgba(0,0,0,0.14)]",
      className,
    ),
    ...props,
  }),
);
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) =>
  _jsx("div", {
    ref: ref,
    className: cn("flex flex-col gap-2 p-6 pb-4", className),
    ...props,
  }),
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) =>
  _jsx("div", {
    ref: ref,
    className: cn(
      "font-display text-lg font-bold leading-none tracking-tight",
      className,
    ),
    ...props,
  }),
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) =>
  _jsx("div", {
    ref: ref,
    className: cn("text-sm font-normal text-muted-foreground", className),
    ...props,
  }),
);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) =>
  _jsx("div", { ref: ref, className: cn("p-6 pt-0", className), ...props }),
);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) =>
  _jsx("div", {
    ref: ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props,
  }),
);
CardFooter.displayName = "CardFooter";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
