import type { FieldValues, UseFormRegister, Path, FieldError } from 'react-hook-form';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

export interface BaseFieldProps<T extends FieldValues> {
    label: string;
    description?: string;
    error?: FieldError;
    name: Path<T>;
    register: UseFormRegister<T>;
}

export interface InputFieldProps<T extends FieldValues> extends BaseFieldProps<T>, Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
    icon?: ReactNode;
}

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectFieldProps<T extends FieldValues> extends BaseFieldProps<T>, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
    options: SelectOption[];
}

export interface TextareaFieldProps<T extends FieldValues> extends BaseFieldProps<T>, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {}
