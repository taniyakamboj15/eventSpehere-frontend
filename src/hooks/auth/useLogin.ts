import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { loginSchema } from '../../validators/auth.schema';
import { authApi, type LoginDTO } from '../../services/api/auth.api';
import { setCredentials } from '../../store/authSlice';
import { ROUTES } from '../../constants/routes';
import { UI_TEXT } from '../../constants/text.constants';

export const useLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
  
    const form = useForm<LoginDTO>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data: LoginDTO) => {
        try {
            setServerError(null);
            const response = await authApi.login(data);
            
            toast.success(UI_TEXT.AUTH_LOGIN_SUCCESS);
            if (response) {
                dispatch(setCredentials({
                    user: response.user,
                    accessToken: response.accessToken,
                }));
            }

            navigate(ROUTES.DASHBOARD);
        } catch (error) {
            if (error instanceof AxiosError) {
                const message = error.response?.data?.message || UI_TEXT.AUTH_LOGIN_FAILED;
                setServerError(message);
                toast.error(message);

                if (error.response?.status === 403 && message.toLowerCase().includes('verify')) {
                    navigate(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(data.email)}`);
                }
            } else {
                setServerError(UI_TEXT.AUTH_UNEXPECTED_ERROR);
                toast.error(UI_TEXT.AUTH_UNEXPECTED_ERROR);
            }
        }
    };

    return { form, serverError, onSubmit };
};
