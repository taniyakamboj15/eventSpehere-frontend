import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadApi } from '../services/api/upload.api';
import Button from './Button';
import { cn } from '../utils/cn';

interface ImageUploadProps {
    onUpload: (url: string) => void;
    defaultImage?: string;
    className?: string;
}

const ImageUpload = ({ onUpload, defaultImage, className }: ImageUploadProps) => {
    const [preview, setPreview] = useState<string | null>(defaultImage || null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview immediate
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        try {
            setIsUploading(true);
            const data = await uploadApi.uploadImage(file);
            onUpload(data.url);
        } catch (error) {
            console.error('Upload failed', error);
            alert('Failed to upload image');
            setPreview(null); // revert on failure
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onUpload('');
        if (fileInputRef.current) fileInputRef.current.value = '';
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
            
            {isUploading ? (
                <div className="flex flex-col items-center text-primary">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <span className="text-sm font-medium">Uploading...</span>
                </div>
            ) : preview ? (
                <div className="relative w-full h-full">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
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
                    <span className="text-sm font-medium">Click to upload cover image</span>
                    <span className="text-xs text-textSecondary/70 mt-1">JPG, PNG up to 5MB</span>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
