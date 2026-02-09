import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { UI_TEXT } from '../../constants/text.constants';

interface StatusHandlerProps {
    isLoading: boolean;
    error?: string | null;
    children: React.ReactNode;
    isEmpty?: boolean;
    emptyTitle?: string;
    emptyMessage?: string;
    emptyIcon?: React.ReactNode;
    loadingComponent?: React.ReactNode;
}

const StatusHandler = ({ 
    isLoading, 
    error, 
    children, 
    isEmpty,
    emptyTitle,
    emptyMessage,
    emptyIcon,
    loadingComponent
}: StatusHandlerProps) => {
    if (isLoading && !isEmpty && !children) {
        if (loadingComponent) return <>{loadingComponent}</>;
        
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-600 font-bold text-lg mb-2">{UI_TEXT.OOPS_ERROR}</p>
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    if (isEmpty && !isLoading) {
        return (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                {emptyIcon}
                <h3 className="text-2xl font-black text-text mb-2">{emptyTitle}</h3>
                <p className="text-textSecondary">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <>
            {children}
            {isLoading && (
                <div className="py-8 flex justify-center">
                    <Loader2 className="animate-spin text-primary w-8 h-8" />
                </div>
            )}
        </>
    );
};

export default StatusHandler;
