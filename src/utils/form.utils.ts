import type { FieldErrors } from 'react-hook-form';

export const getNestedError = (errors: FieldErrors<any>, path: string) => {
    const parts = path.split('.');
    let current: any = errors;
    
    for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
            current = current[part];
        } else {
            return undefined;
        }
    }
    
    return current;
};
