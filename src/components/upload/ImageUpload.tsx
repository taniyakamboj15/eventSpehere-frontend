import { Upload, X, Loader2 } from 'lucide-react';
import Button from '../common/Button';
import { cn } from '../../utils/cn';
import { UI_TEXT } from '../../constants/text.constants';
import { useImageUpload } from '../../hooks/useImageUpload';
import type { ImageUploadProps } from '../../types/upload.types';

const UploadingState = () => (
    <div className="flex flex-col items-center text-primary">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <span className="text-sm font-medium">{UI_TEXT.UPLOADING_LABEL}</span>
    </div>
);

const PreviewState = ({ preview, handleRemove }: { preview: string, handleRemove: () => void }) => (
    <div className="relative w-full h-full">
        <img src={preview} alt={UI_TEXT.UPLOAD_PREVIEW_ALT} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 z-20">
             <Button 
                type="button" 
                variant="danger" 
                size="sm" 
                onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    handleRemove();
                }}
            >
                <X className="w-4 h-4" />
             </Button>
        </div>
    </div>
);

const EmptyState = () => (
    <div className="flex flex-col items-center text-textSecondary pointer-events-none">
        <Upload className="w-8 h-8 mb-2" />
        <span className="text-sm font-medium">{UI_TEXT.CLICK_TO_UPLOAD}</span>
        <span className="text-xs text-textSecondary/70 mt-1">{UI_TEXT.UPLOAD_HINT}</span>
    </div>
);

const ImageUpload = ({ onUpload, defaultImage, className }: ImageUploadProps) => {
    const { preview, isUploading, fileInputRef, handleFileChange, handleRemove } = useImageUpload(onUpload, defaultImage);

    const renderContent = () => {
        if (isUploading) return <UploadingState />;
        if (preview) return <PreviewState preview={preview} handleRemove={handleRemove} />;
        return <EmptyState />;
    };

    return (
        <div className={cn("relative w-full aspect-video bg-gray-50 border-2 border-dashed border-border rounded-xl flex items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors", className)}>
            <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
                disabled={isUploading}
                ref={fileInputRef}
            />
            {renderContent()}
        </div>
    );
};

export default ImageUpload;
