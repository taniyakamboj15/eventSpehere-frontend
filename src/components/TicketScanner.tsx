import { useTicketScanner } from '../hooks/useTicketScanner';
import { X } from 'lucide-react';
import { UI_TEXT } from '../constants/text.constants';

interface TicketScannerProps {
    eventId: string;
    onClose: () => void;
    onScanSuccess: () => void;
}

export const TicketScanner = ({ eventId, onClose, onScanSuccess }: TicketScannerProps) => {
    // Custom hook handles all scanning logic
    useTicketScanner({ eventId, onScanSuccess });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-4 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
                style={{ zIndex: 60 }}
            >
                <X size={24} />
            </button>

            <div className="w-full max-w-md p-4 relative">
                <div className="text-center mb-6 text-white">
                    <h2 className="text-2xl font-bold mb-2">{UI_TEXT.SCAN_TICKET_TITLE}</h2>
                    <p className="opacity-70">{UI_TEXT.SCAN_INSTRUCTION}</p>
                </div>

                <div className="bg-black rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl relative min-h-[300px]">
                    <div id="reader" className="w-full h-full"></div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-white/50 text-sm">
                        {UI_TEXT.MANUAL_ENTRY_PROMPT} <span className="text-white font-bold cursor-pointer hover:underline" onClick={onClose}>{UI_TEXT.ATTENDEE_LIST_LINK}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};
