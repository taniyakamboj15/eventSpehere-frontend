import React, { memo } from 'react';
import type { UseFormRegister, FieldValues, Path, FieldError } from 'react-hook-form';
import { cn } from '../utils/cn';

interface InputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
}

const Input = memo(<T extends FieldValues>({ label, name, register, error, className, icon, ...props }: InputProps<T> & { icon?: React.ReactNode }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-textSecondary mb-1">
        {label}
      </label>
      <div className="relative">
          {icon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {icon}
              </div>
          )}
          <input
            id={name}
            {...register(name)}
            className={cn(
              "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
              icon ? "pl-10" : "",
              error ? "border-error focus:ring-error" : "border-border",
              className
            )}
            {...props}
          />
      </div>
      {error && <p className="mt-1 text-sm text-error">{error.message}</p>}
    </div>
  );
}) as <T extends FieldValues>(props: InputProps<T> & { icon?: React.ReactNode }) => React.ReactElement;

export default Input;
