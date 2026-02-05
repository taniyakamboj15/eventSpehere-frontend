import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../../validators/auth.schema';
import { authApi, type RegisterDTO } from '../../services/api/auth.api';
import { ROUTES } from '../../constants/routes';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const RegisterForm = () => {
 
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDTO>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterDTO) => {
    try {
      setServerError(null);
      await authApi.register(data);
      
      toast.success('Registration successful! Please check your email for the OTP.');
      navigate(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        setServerError(error.response?.data?.message || 'Registration failed');
        toast.error(error.response?.data?.message || 'Registration failed');
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
        label="Full Name"
        name="name"
        type="text"
        register={register}
        error={errors.name}
        placeholder="John Doe"
      />

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

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        register={register}
        error={errors.confirmPassword}
        placeholder="••••••••"
      />
      
      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
      >
        Sign Up
      </Button>
      
      <div className="text-center text-sm text-textSecondary mt-4">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
