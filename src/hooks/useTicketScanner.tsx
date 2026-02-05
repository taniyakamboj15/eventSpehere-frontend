import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { rsvpApi } from '../services/api/rsvp.api';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { ERROR_MESSAGES } from '../constants/text.constants';
import { Check } from 'lucide-react';
import React from 'react';

interface UseTicketScannerProps {
    eventId: string;
    onScanSuccess?: () => void;
}

export const useTicketScanner = ({ eventId, onScanSuccess }: UseTicketScannerProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    const processTicket = useCallback(async (ticketCode: string) => {
        setIsProcessing(true);
        try {
            await rsvpApi.scanTicket(eventId, ticketCode);
            
            // Custom Toast for Success
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg`}>
                    <div className="bg-white/20 p-2 rounded-full"><Check size={24} strokeWidth={3} /></div>
                    <div>
                        <p className="font-bold text-lg">{ERROR_MESSAGES.CHECK_IN_SUCCESS}</p>
                        <p className="text-white/90 text-sm">{ERROR_MESSAGES.TICKET_VALID}</p>
                    </div>
                </div>
            ));

            onScanSuccess?.();
            return true;
        } catch (error: unknown) {
            const message = error instanceof AxiosError 
                ? error.response?.data?.message 
                : ERROR_MESSAGES.INVALID_TICKET;
            toast.error(message || ERROR_MESSAGES.INVALID_TICKET);
            return false;
        } finally {
            // Delay to prevent immediate re-scan
            await new Promise(r => setTimeout(r, 2000));
            setIsProcessing(false);
        }
    }, [eventId, onScanSuccess]);

    useEffect(() => {
        const formatsToSupport = [Html5QrcodeSupportedFormats.QR_CODE];
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            formatsToSupport: formatsToSupport
        };

        const scanner = new Html5QrcodeScanner("reader", config, false);
        scannerRef.current = scanner;

        const onScanSuccessCallback = async (decodedText: string) => {
             if (isProcessing) return;
             
             scanner.pause(true); 
             await processTicket(decodedText);
             try {
                scanner.resume(); 
             } catch (e) {
                // Scanner might have been cleared
             }
        };

        scanner.render(onScanSuccessCallback, (_err) => {});

        return () => {
             if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
            }
        };
    }, [isProcessing, processTicket]);

    return { isProcessing };
};
