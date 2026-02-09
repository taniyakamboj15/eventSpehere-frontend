import { memo } from 'react';
import Button from '../common/Button';
import { BUTTON_TEXT } from '../../constants/text.constants';
import type { GoingStateProps, JoinStateProps } from '../../types/rsvp.types';

export const GoingState = memo(({ onCancel, isLoading }: GoingStateProps) => (
    <div className="flex gap-2">
        <Button variant="outline" disabled className="bg-green-50 text-green-700 border-green-200">
             {BUTTON_TEXT.GOING}
        </Button>
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            isLoading={isLoading}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold"
        >
            {BUTTON_TEXT.CANCEL}
        </Button>
    </div>
));

const rsvpTextLookup = {
    true: BUTTON_TEXT.SOLD_OUT,
    false: BUTTON_TEXT.JOIN_EVENT
} as const;

export const JoinState = memo(({ onJoin, isLoading, disabled }: JoinStateProps) => {
    return (
        <Button 
            onClick={onJoin} 
            isLoading={isLoading}
            disabled={disabled}
            className="font-bold shadow-lg shadow-primary/20"
        >
            {rsvpTextLookup[String(!!disabled) as 'true' | 'false']}
        </Button>
    );
});

const RSVPStates = {
    Going: GoingState,
    Join: JoinState
};

export default RSVPStates;
