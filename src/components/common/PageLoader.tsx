import { Loader2 } from 'lucide-react';

export const PageLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-black text-text italic">EventSphere</span>
                <div className="h-1 w-24 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-[loading_1.5s_infinite_ease-in-out]" style={{ width: '40%' }}></div>
                </div>
            </div>
        </div>
    );
};
