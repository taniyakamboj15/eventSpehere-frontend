export const buttonBaseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

export const buttonVariants: Record<string, string> = {
  primary: "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25",
  secondary: "bg-surface text-text hover:bg-gray-100 border border-border",
  outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/5",
  ghost: "bg-transparent text-textSecondary hover:bg-gray-100 hover:text-text",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25",
};

export const buttonSizes: Record<string, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};
