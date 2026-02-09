import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerSchema } from '../../validators/auth.schema';
import { type RegisterDTO } from '../../services/api/auth.api';
import { ROUTES } from '../../constants/routes';
import { useActionForm } from '../utils/useActionForm';

export const useRegister = () => {
    const navigate = useNavigate();
    
    const { form, serverError, onSubmit, actionData } = useActionForm<RegisterDTO>(
        registerSchema,
        ROUTES.REGISTER
    );

    useEffect(() => {
        if (actionData?.success && actionData.email) {
            navigate(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(actionData.email)}`);
        }
    }, [actionData, navigate]);

    return { form, serverError, onSubmit };
};
