import { type ActionFunctionArgs } from 'react-router-dom';
import { authApi, type LoginDTO, type RegisterDTO } from '../../services/api/auth.api';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  
  try {
    const response = await authApi.login(data as unknown as LoginDTO); 
    if (!response) {
      throw new Error('Invalid response from server');
    }
    toast.success('Welcome back!');
    return { success: true, user: response.user, accessToken: response.accessToken };
  } catch (error: unknown) {
      if (error instanceof AxiosError) {
          return { 
            success: false,
            error: error.response?.data?.message || 'Login failed',
            fieldErrors: error.response?.data?.errors 
          };
      }
      return { success: false, error: 'An unexpected error occurred' };
  }
};

export const registerAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    try {
    await authApi.register(data as unknown as RegisterDTO);
    toast.success('Registration successful! Please verify your email.');
    return { success: true, email: data.email as string };
  } catch (error: unknown) {
      if (error instanceof AxiosError) {
          return { 
            success: false,
            error: error.response?.data?.message || 'Registration failed',
            fieldErrors: error.response?.data?.errors 
          };
      }
      return { success: false, error: 'An unexpected error occurred' };
  }
};
