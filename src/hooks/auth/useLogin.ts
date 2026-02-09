import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSchema } from '../../validators/auth.schema';
import { type LoginDTO } from '../../services/api/auth.api';
import { setCredentials } from '../../store/authSlice';
import { ROUTES } from '../../constants/routes';
import { useActionForm } from '../utils/useActionForm';

export const useLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
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
            navigate(ROUTES.DASHBOARD);
        }
    }, [actionData, dispatch, navigate]);

    return { form, serverError, onSubmit };
};
