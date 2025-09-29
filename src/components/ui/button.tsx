import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md rounded-full",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full",
        outline: "border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 rounded-full backdrop-blur-sm",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-full",
        ghost: "hover:bg-gray-100 rounded-full",
        link: "text-primary underline-offset-4 hover:underline rounded-full",
        stragram: "bg-stragram-primary text-white hover:bg-stragram-primary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] font-semibold rounded-full border-0",
        follow: "bg-black text-white hover:bg-gray-800 active:bg-gray-900 font-medium rounded-full border-0 hover:scale-[1.02] active:scale-[0.98]",
        google: "bg-blue-500 text-white hover:bg-blue-600 border-0 rounded-full",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-8 px-4 py-1.5 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };