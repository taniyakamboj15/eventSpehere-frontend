import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

interface FeatureItemProps {
    icon: LucideIcon;
    title: string;
    desc: string;
}

export const FeatureItem = memo(({ icon: Icon, title, desc }: FeatureItemProps) => (
    <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
        <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
            </div>
        </div>
        <div>
            <h4 className="font-semibold text-text mb-1">{title}</h4>
            <p className="text-sm text-textSecondary">{desc}</p>
        </div>
    </div>
));
