import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-sans font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500",
  {
    variants: {
      variant: {
        primary:
          "bg-gold-500 text-black hover:bg-gold-600 focus-visible:ring-gold-500",
        secondary:
          "bg-white text-gray-800 border-2 border-gold-500 hover:bg-gold-50 focus-visible:ring-gold-500",
        ghost:
          "bg-transparent text-gold-700 hover:bg-gold-500/10 focus-visible:ring-gold-500",
        google:
          "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-sm focus-visible:ring-gray-300",
      },
      size: {
        default: "h-12 px-6 text-body",
        sm: "h-10 px-4 text-body-sm",
        lg: "h-14 px-8 text-body",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
