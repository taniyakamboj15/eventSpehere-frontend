import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { authApi } from '../../services/api/auth.api';
import { setCredentials } from '../../store/authSlice';
import { ROUTES } from '../../constants/routes';
import { UI_TEXT } from '../../constants/text.constants';

export const useVerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Get email from query params
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email') || '';
    
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error(UI_TEXT.AUTH_VERIFY_INVALID_LENGTH);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const response = await authApi.verifyEmail({ email, token: otp });
            
            toast.success(UI_TEXT.AUTH_VERIFY_SUCCESS);
            
            if (response) {
                dispatch(setCredentials({
                    user: response.user,
                    accessToken: response.accessToken,
                }));
            }

            navigate(ROUTES.DASHBOARD);
        } catch (err) {
            if (err instanceof AxiosError) {
                const msg = err.response?.data?.message || UI_TEXT.AUTH_VERIFY_FAILED;
                setError(msg);
                toast.error(msg);
            } else {
                setError(UI_TEXT.AUTH_UNEXPECTED_ERROR);
                toast.error(UI_TEXT.AUTH_UNEXPECTED_ERROR);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = () => {
        toast.success(UI_TEXT.AUTH_RESEND_SUCCESS);
    };

    return { 
        otp, 
        setOtp, 
        isLoading, 
        error, 
        handleSubmit, 
        handleResend 
    };
};
