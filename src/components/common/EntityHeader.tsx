import { memo } from 'react';
import Button from './Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { EntityHeaderProps } from '../../types/button.types';

const EntityHeader = memo(({ 
    label, 
    title, 
    backUrl, 
    backLabel, 
    actions,
    children 
}: EntityHeaderProps) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (backUrl === -1) {
            navigate(-1);
        } else if (backUrl) {
            navigate(backUrl);
        }
    };

    return (
        <div className="mb-8">
            {backUrl && (
                <Button 
                    variant="ghost" 
                    className="mb-6 pl-0 gap-2 hover:bg-transparent text-textSecondary hover:text-primary transition-colors" 
                    onClick={handleBack}
                >
                    <ArrowLeft className="w-4 h-4" /> {backLabel || 'Back'}
                </Button>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    {label && (
                        <span className="text-sm font-bold text-primary uppercase tracking-wider mb-1 block">
                            {label}
                        </span>
                    )}
                    <h1 className="text-3xl font-black text-text">{title}</h1>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {actions?.map((action, idx) => (
                        <Button
                            key={idx}
                            variant={action.variant || 'primary'}
                            onClick={action.onClick}
                            isLoading={action.isLoading}
                            className="gap-2"
                        >
                            {action.icon}
                            {action.label}
                        </Button>
                    ))}
                    {children}
                </div>
            </div>
        </div>
    );
});

export default EntityHeader;
