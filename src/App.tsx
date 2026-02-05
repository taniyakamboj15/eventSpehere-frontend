import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store/store';
import { authApi } from './services/api/auth.api';
import { setCredentials, setLoading, logout } from './store/authSlice';
import AuthLayout from './layout/AuthLayout';
import MainLayout from './layout/MainLayout';
import DashboardLayout from './layout/DashboardLayout';
import { ROUTES } from './constants/routes';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import { PageLoader } from './components/PageLoader';
import { RoleBasedRoute } from './routes/RoleBasedRoute';

// Lazy Load Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage'));
const CreateEventPage = lazy(() => import('./pages/CreateEventPage'));
const EditEventPage = lazy(() => import('./pages/EditEventPage'));
const CheckInPage = lazy(() => import('./pages/CheckInPage'));
const EventDetailsPage = lazy(() => import('./pages/EventDetailsPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const CreateCommunityPage = lazy(() => import('./pages/CreateCommunityPage'));
const CommunityDetailsPage = lazy(() => import('./pages/CommunityDetailsPage'));
const EventManagePage = lazy(() => import('./pages/EventManagePage'));
const VerifyEmailPage = lazy(() => import('./features/auth/VerifyEmailForm'));

function App() {
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
      } catch (error) {
        console.warn('Session restoration failed or no active session');
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
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.EVENTS} element={<DiscoverPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/events/:id/manage" element={ 
                <RoleBasedRoute requiredRole="ORGANIZER">
                  <EventManagePage />
                </RoleBasedRoute>
              } />
            <Route path="/profile" element={
              <RoleBasedRoute requiredRole="ATTENDEE">
                   <UserProfilePage />
              </RoleBasedRoute>
            } />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<DashboardLayout />}>
             <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
             <Route path={ROUTES.CREATE_EVENT} element={
                <RoleBasedRoute requiredRole="ORGANIZER">
                   <CreateEventPage />
                </RoleBasedRoute>
             } />
             <Route path="/events/:id/edit" element={
                <RoleBasedRoute requiredRole="ORGANIZER">
                   <EditEventPage />
                </RoleBasedRoute>
             } />
             <Route path="/events/:id/checkin" element={
                <RoleBasedRoute requiredRole="ORGANIZER">
                   <CheckInPage />
                </RoleBasedRoute>
             } />
             <Route path="/communities/create" element={
                <RoleBasedRoute requiredRole="ORGANIZER">
                   <CreateCommunityPage />
                </RoleBasedRoute>
             } />
             <Route path="/communities/:id" element={<CommunityDetailsPage />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
