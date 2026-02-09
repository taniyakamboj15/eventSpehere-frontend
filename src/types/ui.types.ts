import { type ReactNode } from 'react';
import type { FieldError, UseFormRegister, FieldValues, Path } from 'react-hook-form';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export interface InputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  icon?: ReactNode;
}
