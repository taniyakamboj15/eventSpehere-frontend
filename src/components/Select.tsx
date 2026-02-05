import React, { memo } from 'react';
import type { UseFormRegister, FieldValues, Path, FieldError } from 'react-hook-form';
import { cn } from '../utils/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps<T extends FieldValues> extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  options: SelectOption[];
}

const Select = memo(<T extends FieldValues>({ label, name, register, error, options, className, ...props }: SelectProps<T>) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-textSecondary mb-1">
        {label}
      </label>
      <select
        id={name}
        {...register(name)}
        className={cn(
          "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-white",
          error ? "border-error focus:ring-error" : "border-border",
          className
        )}
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-error">{error.message}</p>}
    </div>
  );
}) as <T extends FieldValues>(props: SelectProps<T>) => React.ReactElement;

export default Select;
