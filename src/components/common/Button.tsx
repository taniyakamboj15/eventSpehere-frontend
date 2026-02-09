import { memo } from 'react';
import { cn } from '../../utils/cn';
import { BUTTON_VARIANTS, BUTTON_SIZES } from '../../constants/button.constants';
import type { ButtonProps } from '../../types/button.types';

const LoadingSpinner = () => (
  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);

const Button = memo(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className, 
  disabled, 
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </button>
  );
});

export default Button;
