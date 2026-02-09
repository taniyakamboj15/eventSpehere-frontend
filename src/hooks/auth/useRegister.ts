import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerSchema } from '../../validators/auth.schema';
import { type RegisterDTO } from '../../services/api/auth.api';
import { ROUTES } from '../../constants/routes';
import { useActionForm } from '../utils/useActionForm';
import type { RegisterActionResponse } from '../../types/auth.types';

export const useRegister = () => {
    const navigate = useNavigate();
    
    const { form, serverError, onSubmit, actionData } = useActionForm<RegisterDTO>(
        registerSchema,
        ROUTES.REGISTER
    );

    const registerData = actionData as unknown as RegisterActionResponse | undefined;

    useEffect(() => {
        if (registerData?.success && registerData.email) {
            navigate(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(registerData.email)}`);
        }
    }, [registerData, navigate]);

    return { form, serverError, onSubmit };
};
