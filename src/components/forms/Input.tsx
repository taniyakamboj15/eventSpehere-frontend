import { memo, type ReactElement } from 'react';
import { cn } from '../../utils/cn';
import type { FieldValues } from 'react-hook-form';
import type { InputFieldProps } from './types';
import { INPUT_STYLES } from '../../constants/style.constants';

const Input = memo(<T extends FieldValues>({ 
    label, 
    name, 
    register, 
    error, 
    className, 
    icon, 
    ...props 
}: InputFieldProps<T>) => {
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
              INPUT_STYLES.BASE,
              icon && INPUT_STYLES.ICON_PADDING,
              error ? INPUT_STYLES.ERROR : INPUT_STYLES.DEFAULT,
              className
            )}
            {...props}
          />
      </div>
      {error && <p className="mt-1 text-sm text-error">{error.message}</p>}
    </div>
  );
}) as <T extends FieldValues>(props: InputFieldProps<T>) => ReactElement;

export default Input;
