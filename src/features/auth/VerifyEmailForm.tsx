import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api/auth.api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { ROUTES } from '../../constants/routes';
import Button from '../../components/Button';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const VerifyEmailForm = () => {
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
      toast.error('Please enter a 6-digit code');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.verifyEmail({ email, token: otp });
      
      toast.success('Email verified successfully!');
      
               if (response) {
                   dispatch(setCredentials({
                       user: response.user,
                       accessToken: response.accessToken,
                   }));
               }

      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      if (err instanceof AxiosError) {
        const msg = err.response?.data?.message || 'Verification failed';
        setError(msg);
        toast.error(msg);
      } else {
        setError('An unexpected error occurred');
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-error p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text">Verification Code</label>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl tracking-[1em] font-mono"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full py-4 text-lg font-semibold"
        isLoading={isLoading}
      >
        Verify & Complete Signup
      </Button>

      <div className="text-center text-sm text-textSecondary">
        Didn't receive the code?{' '}
        <button 
          type="button"
          onClick={() => toast.success('A new code has been sent (feature coming soon!)')}
          className="text-primary hover:underline"
        >
          Resend Code
        </button>
      </div>
    </form>
  );
};

export default VerifyEmailForm;
