import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
    size?: "sm" | "md" | "lg"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-[var(--color-brand-rose)] text-white hover:opacity-90 shadow-sm",
            secondary: "bg-[var(--color-brand-sage)] text-white hover:opacity-90 shadow-sm",
            outline: "border-2 border-[var(--color-brand-rose)] text-[var(--color-brand-rose)] hover:bg-[var(--color-brand-rose-light)]",
            ghost: "text-[var(--color-brand-rose)] hover:bg-[var(--color-brand-rose-light)]/50",
            danger: "bg-red-500 text-white hover:bg-red-600",
        }

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-6 text-lg",
        }

        return (
            <button
                ref={ref}
                className={cn(
                    "cursor-pointer inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
