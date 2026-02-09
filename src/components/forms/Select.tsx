import { memo, type ReactElement } from 'react';
import { cn } from '../../utils/cn';
import type { FieldValues } from 'react-hook-form';
import type { SelectFieldProps } from './types';
import { INPUT_STYLES } from '../../constants/style.constants';

const Select = memo(<T extends FieldValues>({ 
    label, 
    name, 
    register, 
    error, 
    options, 
    className, 
    ...props 
}: SelectFieldProps<T>) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-textSecondary mb-1">
        {label}
      </label>
      <select
        id={name}
        {...register(name)}
        className={cn(
          INPUT_STYLES.BASE,
          "bg-white",
          error ? INPUT_STYLES.ERROR : INPUT_STYLES.DEFAULT,
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
}) as <T extends FieldValues>(props: SelectFieldProps<T>) => ReactElement;

export default Select;
