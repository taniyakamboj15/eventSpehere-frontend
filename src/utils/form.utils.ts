import type { FieldErrors, FieldValues, FieldError } from 'react-hook-form';

export const getNestedError = (errors: FieldErrors<FieldValues>, path: string): FieldError | undefined => {
    const parts = path.split('.');
    let current: unknown = errors;
    
    for (const part of parts) {
        if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
            current = (current as Record<string, unknown>)[part];
        } else {
            return undefined;
        }
    }
    
    return current as FieldError | undefined;
};
