import { UI_TEXT } from '../../constants/text.constants';
import { TAB_STYLES } from '../../constants/style.constants';
import type { TabNavigationProps } from '../../types/community.types';
import { cn } from '../../utils/cn';

const TabNavigation = ({ activeTab, setActiveTab, memberCount, isAdmin }: TabNavigationProps) => {
    return (
        <div className="flex border-b border-gray-100">
            <button 
                onClick={() => setActiveTab('members')}
                className={cn(
                    TAB_STYLES.BASE,
                    activeTab === 'members' ? TAB_STYLES.ACTIVE : TAB_STYLES.INACTIVE
                )}
            >
                {UI_TEXT.MEMBERS_TAB} ({memberCount})
            </button>
            {isAdmin && (
                <button 
                    onClick={() => setActiveTab('invite')}
                    className={cn(
                        TAB_STYLES.BASE,
                        activeTab === 'invite' ? TAB_STYLES.ACTIVE : TAB_STYLES.INACTIVE
                    )}
                >
                    {UI_TEXT.INVITE_TAB}
                </button>
            )}
        </div>
    );
};

export default TabNavigation;
