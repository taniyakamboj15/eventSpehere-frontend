import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { rsvpApi } from '../services/api/rsvp.api';
import { X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';

interface TicketScannerProps {
    eventId: string;
    onClose: () => void;
    onScanSuccess: () => void;
}

export const TicketScanner = ({ eventId, onClose, onScanSuccess }: TicketScannerProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Initialize Scanner on mount
        const formatsToSupport = [
            Html5QrcodeSupportedFormats.QR_CODE,
        ];

        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            formatsToSupport: formatsToSupport
        };

        const scanner = new Html5QrcodeScanner(
            "reader", 
            config,
            /* verbose= */ false
        );
        
        scannerRef.current = scanner;

        const onScanSuccessCallback = async (decodedText: string) => {
             if (isProcessing) return;
             
             // Pause scanning briefly
             scanner.pause(true); 
             
             await processTicket(decodedText);
             
             // Resume if we haven't closed
             try {
                scanner.resume(); 
             } catch (e) {
                // If scanner was cleared, this might throw
             }
        };

        const onScanFailureCallback = (_errorMessage: string) => {
            // handle error if needed, but usually just ignore frame errors
        };

        scanner.render(onScanSuccessCallback, onScanFailureCallback);

        // Cleanup
        return () => {
             if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
            }
        };
    }, []);

    const processTicket = async (ticketCode: string) => {
        setIsProcessing(true);
        try {
            await rsvpApi.scanTicket(eventId, ticketCode);
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg`}>
                    <div className="bg-white/20 p-2 rounded-full"><Check size={24} strokeWidth={3} /></div>
                    <div>
                        <p className="font-bold text-lg">Check-in Successful!</p>
                        <p className="text-white/90 text-sm">Ticket valid.</p>
                    </div>
                </div>
            ));
            onScanSuccess();
        } catch (error: unknown) {
            const message = error instanceof AxiosError 
                ? error.response?.data?.message 
                : 'Invalid Ticket';
            toast.error(message || 'Invalid Ticket');
        } finally {
            // Delay to prevent immediate re-scan of same code if user holds it there
            await new Promise(r => setTimeout(r, 2000));
            setIsProcessing(false);
        }
    };

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
                    <h2 className="text-2xl font-bold mb-2">Scan Ticket</h2>
                    <p className="opacity-70">Point camera at the attendee's QR code</p>
                </div>

                <div className="bg-black rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl relative min-h-[300px]">
                    <div id="reader" className="w-full h-full"></div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-white/50 text-sm">
                        Or enter code manually via <span className="text-white font-bold cursor-pointer hover:underline" onClick={onClose}>Attendee List</span>
                    </p>
                </div>
            </div>
        </div>
    );
};
