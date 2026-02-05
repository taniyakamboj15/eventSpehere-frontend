import { Upload, X, Loader2 } from 'lucide-react';
import Button from './Button';
import { cn } from '../utils/cn';
import { UI_TEXT } from '../constants/text.constants';
import { useImageUpload } from '../hooks/useImageUpload';

interface ImageUploadProps {
    onUpload: (url: string) => void;
    defaultImage?: string;
    className?: string;
}

const ImageUpload = ({ onUpload, defaultImage, className }: ImageUploadProps) => {
    const { preview, isUploading, fileInputRef, handleFileChange, handleRemove } = useImageUpload(onUpload, defaultImage);

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
            
            {isUploading ? (
                <div className="flex flex-col items-center text-primary">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <span className="text-sm font-medium">{UI_TEXT.UPLOADING_LABEL}</span>
                </div>
            ) : preview ? (
                <div className="relative w-full h-full">
                    <img src={preview} alt={UI_TEXT.UPLOAD_PREVIEW_ALT} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 z-20">
                         <Button 
                            type="button" 
                            variant="danger" 
                            size="sm" 
                            onClick={(e) => {
                                e.preventDefault();
                                handleRemove();
                            }}
                        >
                            <X className="w-4 h-4" />
                         </Button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center text-textSecondary pointer-events-none">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">{UI_TEXT.CLICK_TO_UPLOAD}</span>
                    <span className="text-xs text-textSecondary/70 mt-1">{UI_TEXT.UPLOAD_HINT}</span>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
