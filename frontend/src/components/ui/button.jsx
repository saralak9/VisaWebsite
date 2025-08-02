import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "kpvs-btn-primary shadow-sm hover:shadow-md",
        destructive:
          "kpvs-bg-error text-white shadow-sm hover:kpvs-bg-error-dark",
        outline:
          "kpvs-btn-secondary shadow-sm",
        secondary:
          "kpvs-bg-gray-100 kpvs-text-gray-900 shadow-sm hover:kpvs-bg-gray-200",
        ghost: "hover:kpvs-bg-blue-50 hover:kpvs-text-blue",
        link: "kpvs-text-blue underline-offset-4 hover:underline",
        accent: "kpvs-btn-accent shadow-sm hover:shadow-md",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base font-semibold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
