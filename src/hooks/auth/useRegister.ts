import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { registerSchema } from '../../validators/auth.schema';
import { authApi, type RegisterDTO } from '../../services/api/auth.api';
import { ROUTES } from '../../constants/routes';
import { UI_TEXT } from '../../constants/text.constants';

export const useRegister = () => {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
  
    const form = useForm<RegisterDTO>({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterDTO) => {
        try {
            setServerError(null);
            await authApi.register(data);
            
            toast.success(UI_TEXT.AUTH_REGISTER_SUCCESS);
            navigate(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(data.email)}`);
        } catch (error) {
            if (error instanceof AxiosError) {
                const message = error.response?.data?.message || UI_TEXT.AUTH_REGISTER_FAILED;
                setServerError(message);
                toast.error(message);
            } else {
                setServerError(UI_TEXT.AUTH_UNEXPECTED_ERROR);
                toast.error(UI_TEXT.AUTH_UNEXPECTED_ERROR);
            }
        }
    };

    return { form, serverError, onSubmit };
};
