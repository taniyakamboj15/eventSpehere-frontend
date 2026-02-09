import type { ButtonHTMLAttributes } from 'react';
import type { ButtonVariant, ButtonSize } from '../constants/button.constants';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export interface Action {
    label: string;
    onClick: () => void;
    variant?: ButtonVariant;
    icon?: React.ReactNode;
    isLoading?: boolean;
}

export interface EntityHeaderProps {
    label?: string;
    title: string;
    backUrl?: string | -1;
    backLabel?: string;
    actions?: Action[];
    children?: React.ReactNode;
}
