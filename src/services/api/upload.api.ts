import api from './axios';

export interface UploadResponse {
    url: string;
    publicId: string;
}

export const uploadApi = {
    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post<{ success: boolean; data: UploadResponse }>('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },
};
