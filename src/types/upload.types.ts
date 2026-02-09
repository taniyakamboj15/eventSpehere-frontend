export interface ImageUploadProps {
    onUpload: (url: string) => void;
    defaultImage?: string;
    className?: string;
}
