import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/authSlice';
import { authApi } from '../services/api/auth.api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      dispatch(logout());
      navigate(ROUTES.LOGIN);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    signOut,
  };
};
