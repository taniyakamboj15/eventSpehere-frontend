import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

interface UseCaseCardProps {
    icon: LucideIcon;
    title: string;
    desc: string;
    color: string;
    bg: string;
}

export const UseCaseCard = memo(({ icon: Icon, title, desc, color, bg }: UseCaseCardProps) => (
    <div className="bg-surface p-8 rounded-2xl border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center mb-6`}>
            <Icon className={`w-7 h-7 ${color}`} />
        </div>
        <h3 className="text-xl font-bold text-text mb-3">{title}</h3>
        <p className="text-textSecondary leading-relaxed">{desc}</p>
    </div>
));
