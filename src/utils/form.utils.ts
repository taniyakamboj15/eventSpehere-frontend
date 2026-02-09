import type { FieldErrors } from 'react-hook-form';

/**
 * Safely retrieves a nested error from a FieldErrors object using a dot-notated path string.
 * @param errors The FieldErrors object from react-hook-form
 * @param path The path to the field (e.g., 'location.latitude')
 * @returns The FieldError if found, otherwise undefined
 */
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
