export const INPUT_STYLES = {
    BASE: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
    ICON_PADDING: "pl-10",
    ERROR: "border-error focus:ring-error",
    DEFAULT: "border-border"
} as const;

export const NOTIFICATION_STYLES = {
    ITEM_UNREAD: 'bg-blue-50/30',
    TEXT_UNREAD: 'font-semibold text-gray-900',
    TEXT_READ: 'text-gray-800'
} as const;

export const TAB_STYLES = {
    BASE: 'flex-1 py-3 text-sm font-medium transition-colors border-b-2',
    ACTIVE: 'border-primary text-primary',
    INACTIVE: 'border-transparent text-gray-500 hover:text-gray-700'
} as const;
