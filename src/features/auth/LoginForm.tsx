import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../../validators/auth.schema';
import { authApi, type LoginDTO } from '../../services/api/auth.api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { ROUTES } from '../../constants/routes';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { AxiosError } from 'axios';

import toast from 'react-hot-toast';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDTO>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginDTO) => {
    try {
      setServerError(null);
      const response = await authApi.login(data);
      
      toast.success('Logged in successfully!');
                if (response) {
                    dispatch(setCredentials({
                        user: response.user,
                        accessToken: response.accessToken,
                    }));
                }

      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || 'Login failed';
        setServerError(message);
        toast.error(message);

        // If not verified, we can append a hint or redirect
        if (error.response?.status === 403 && message.toLowerCase().includes('verify')) {
            navigate(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(data.email)}`);
        }
      } else {
        setServerError('An unexpected error occurred');
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="bg-red-50 text-error p-3 rounded-lg text-sm text-center">
          {serverError}
        </div>
      )}
      
      <Input
        label="Email"
        name="email"
        type="email"
        register={register}
        error={errors.email}
        placeholder="you@example.com"
      />
      
      <Input
        label="Password"
        name="password"
        type="password"
        register={register}
        error={errors.password}
        placeholder="••••••••"
      />
      
      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
      >
        Sign In
      </Button>
      
      <div className="text-center text-sm text-textSecondary mt-4">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary hover:underline">
          Create one
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
