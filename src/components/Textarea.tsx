import React from 'react';
import type { UseFormRegister, FieldValues, Path, FieldError } from 'react-hook-form';
import { cn } from '../utils/cn';

interface TextareaProps<T extends FieldValues> extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
}

const Textarea = <T extends FieldValues>({ label, name, register, error, className, ...props }: TextareaProps<T>) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-textSecondary mb-1">
        {label}
      </label>
      <textarea
        id={name}
        {...register(name)}
        className={cn(
          "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
          error ? "border-error focus:ring-error" : "border-border",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-error">{error.message}</p>}
    </div>
  );
};

export default Textarea;
