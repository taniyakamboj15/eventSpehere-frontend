import React from 'react';

interface TabNavigationProps {
    activeTab: 'members' | 'invite';
    setActiveTab: (tab: 'members' | 'invite') => void;
    memberCount: number;
    isAdmin: boolean;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab, memberCount, isAdmin }) => {
    return (
        <div className="flex border-b border-gray-100">
            <button 
                onClick={() => setActiveTab('members')}
                className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'members' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                Members ({memberCount})
            </button>
            {isAdmin && (
                <button 
                    onClick={() => setActiveTab('invite')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'invite' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Invite People
                </button>
            )}
        </div>
    );
};

export default TabNavigation;
