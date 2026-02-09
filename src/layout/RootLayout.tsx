import { useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { authApi } from '../services/api/auth.api';
import { setCredentials, setLoading, logout } from '../store/authSlice';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from '../components/system/ErrorBoundary';
import { PageLoader } from '../components/common/PageLoader';

export const RootLayout = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await authApi.refresh();
        if (data && data.user) {
             dispatch(setCredentials({ 
                 user: data.user, 
                 accessToken: data.accessToken 
             }));
        }
      } catch {
        dispatch(logout()); 
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);

  if (isLoading) {
      return <PageLoader />;
  }

  return (
    <ErrorBoundary>
      <Toaster position="top-right" />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
};
