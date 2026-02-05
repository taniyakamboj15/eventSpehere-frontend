import { useState, useRef } from 'react';
import { uploadApi } from '../services/api/upload.api';
import { toast } from 'react-hot-toast';
import { UI_TEXT } from '../constants/text.constants';

export const useImageUpload = (onUpload: (url: string) => void, defaultImage?: string) => {
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
            toast.error(UI_TEXT.UPLOAD_FAILED);
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

    return {
        preview,
        isUploading,
        fileInputRef,
        handleFileChange,
        handleRemove
    };
};
