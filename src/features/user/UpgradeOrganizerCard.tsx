import { Sparkles, Users, Store } from 'lucide-react';
import Button from '../../components/Button';
import { UI_TEXT } from '../../constants/text.constants';

interface UpgradeOrganizerCardProps {
    onUpgrade: () => void;
    isLoading: boolean;
}

export const UpgradeOrganizerCard = ({ onUpgrade, isLoading }: UpgradeOrganizerCardProps) => {
    return (
        <div className="bg-surface rounded-2xl border border-border p-8 md:p-12 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-text text-center lg:text-left">{UI_TEXT.UPGRADE_TITLE}</h2>
                    <p className="text-textSecondary text-lg leading-relaxed text-center lg:text-left">
                        {UI_TEXT.UPGRADE_DESC}
                    </p>
                    <ul className="grid sm:grid-cols-3 lg:grid-cols-1 gap-4">
                            <li className="flex items-center gap-3 text-text">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users size={20} /></div>
                            <span className="font-medium">{UI_TEXT.UPGRADE_ITEM_NEIGHBORHOOD}</span>
                            </li>
                            <li className="flex items-center gap-3 text-text">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Sparkles size={20} /></div>
                            <span className="font-medium">{UI_TEXT.UPGRADE_ITEM_HOBBY}</span>
                            </li>
                            <li className="flex items-center gap-3 text-text">
                            <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Store size={20} /></div>
                            <span className="font-medium">{UI_TEXT.UPGRADE_ITEM_BUSINESS}</span>
                            </li>
                    </ul>
                    </div>

                    <div className="w-full lg:w-96 flex flex-col items-center justify-center text-center space-y-6 bg-background/50 p-8 rounded-xl border border-border">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                            <h3 className="text-xl font-bold text-text mb-2">{UI_TEXT.UPGRADE_CARD_TITLE}</h3>
                            <p className="text-sm text-textSecondary">
                            {UI_TEXT.UPGRADE_CARD_DESC}
                            </p>
                        </div>
                    <Button 
                        size="lg" 
                        className="w-full" 
                        onClick={onUpgrade} 
                        isLoading={isLoading}
                    >
                        {UI_TEXT.UPGRADE_BTN}
                    </Button>
                    <p className="text-xs text-textSecondary italic">
                        {UI_TEXT.UPGRADE_NOTE}
                    </p>
                    </div>
            </div>
        </div>
    );
};
