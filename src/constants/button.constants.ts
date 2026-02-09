export const BUTTON_VARIANTS = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5',
    danger: 'bg-error text-white hover:bg-error/90',
    ghost: 'bg-transparent text-textSecondary hover:bg-gray-100'
} as const;

export const BUTTON_SIZES = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base'
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;
