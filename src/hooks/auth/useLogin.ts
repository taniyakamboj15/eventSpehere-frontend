import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSchema } from '../../validators/auth.schema';
import { type LoginDTO } from '../../services/api/auth.api';
import { setCredentials } from '../../store/authSlice';
import { ROUTES } from '../../constants/routes';
import { useActionForm } from '../utils/useActionForm';
import type { AuthResponse } from '../../types/auth.types';

interface LoginActionResponse extends AuthResponse {
    success: boolean;
}

export const useLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirect');
    
    const { form, serverError, onSubmit, actionData } = useActionForm<LoginDTO>(
        loginSchema, 
        ROUTES.LOGIN
    );

    const loginData = actionData as unknown as LoginActionResponse | undefined;

    useEffect(() => {
        if (loginData?.success && loginData.user) {
            dispatch(setCredentials({ 
                user: loginData.user, 
                accessToken: loginData.accessToken || '' 
            }));
            navigate(redirectTo || ROUTES.DASHBOARD);
        }
    }, [loginData, dispatch, navigate, redirectTo]);

    return { form, serverError, onSubmit };
};
