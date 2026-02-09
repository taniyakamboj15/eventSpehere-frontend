import { cn } from '../../utils/cn';
import type { FieldValues } from 'react-hook-form';
import type { TextareaFieldProps } from './types';
import { INPUT_STYLES } from '../../constants/style.constants';

const Textarea = <T extends FieldValues>({ 
    label, 
    name, 
    register, 
    error, 
    className, 
    ...props 
}: TextareaFieldProps<T>) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-textSecondary mb-1">
        {label}
      </label>
      <textarea
        id={name}
        {...register(name)}
        className={cn(
          INPUT_STYLES.BASE,
          error ? INPUT_STYLES.ERROR : INPUT_STYLES.DEFAULT,
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-error">{error.message}</p>}
    </div>
  );
};

export default Textarea;
