import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSchema } from '../../validators/auth.schema';
import { type LoginDTO } from '../../services/api/auth.api';
import { setCredentials } from '../../store/authSlice';
import { ROUTES } from '../../constants/routes';
import { useActionForm } from '../utils/useActionForm';

export const useLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirect');
    
    const { form, serverError, onSubmit, actionData } = useActionForm<LoginDTO>(
        loginSchema, 
        ROUTES.LOGIN
    );

    useEffect(() => {
        if (actionData?.success && actionData.user) {
            dispatch(setCredentials({ 
                user: actionData.user, 
                accessToken: actionData.accessToken || '' 
            }));
            navigate(redirectTo || ROUTES.DASHBOARD);
        }
    }, [actionData, dispatch, navigate, redirectTo]);

    return { form, serverError, onSubmit };
};
