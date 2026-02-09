import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import { ROUTES } from '../constants/routes';
import { RoleBasedRoute } from './RoleBasedRoute';
import { RootLayout } from '../layout/RootLayout';
import MainLayout from '../layout/MainLayout';
import AuthLayout from '../layout/AuthLayout';
import DashboardLayout from '../layout/DashboardLayout';

// Lazy Load Pages
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const DiscoverPage = lazy(() => import('../pages/DiscoverPage'));
const CreateEventPage = lazy(() => import('../pages/CreateEventPage'));
const EditEventPage = lazy(() => import('../pages/EditEventPage'));
const CheckInPage = lazy(() => import('../pages/CheckInPage'));
const EventDetailsPage = lazy(() => import('../pages/EventDetailsPage'));
const UserProfilePage = lazy(() => import('../pages/UserProfilePage'));
const CreateCommunityPage = lazy(() => import('../pages/CreateCommunityPage'));
const CommunityDetailsPage = lazy(() => import('../pages/CommunityDetailsPage'));
const EventManagePage = lazy(() => import('../pages/EventManagePage'));
const VerifyEmailPage = lazy(() => import('../features/auth/VerifyEmailForm'));

import { eventDetailsLoader } from './loaders/event.loader';

// ... imports

// Loaders
import { dashboardLoader } from './loaders/dashboard.loader';
import { communityDetailsLoader } from './loaders/community.loader';

// Actions
import { loginAction, registerAction } from './actions/auth.action';
import { createEventAction, editEventAction } from './actions/event.action';
import { createCommunityAction } from './actions/community.action';
import { updateProfileAction } from './actions/user.action';
import { rsvpAction } from './actions/rsvp.action';
import { RouteErrorBoundary } from './RouteErrorBoundary';

// Route Configuration
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      // Public Routes
      {
        element: <MainLayout />,
        children: [
          { path: ROUTES.HOME, element: <HomePage /> },
          { path: ROUTES.EVENTS, element: <DiscoverPage /> },
          { 
            path: "/events/:id", 
            element: <EventDetailsPage />,
            loader: eventDetailsLoader,
            action: rsvpAction
          },
          { 
            path: "/events/:id/manage", 
            element: (
              <RoleBasedRoute requiredRole="ORGANIZER">
                <EventManagePage />
              </RoleBasedRoute>
            ) 
          },
          { 
            path: "/profile", 
            element: (
              <RoleBasedRoute requiredRole="ATTENDEE">
                   <UserProfilePage />
              </RoleBasedRoute>
            ),
            action: updateProfileAction 
          }
        ]
      },
      
      // Auth Routes
      {
        element: <AuthLayout />,
        children: [
          { 
            path: ROUTES.LOGIN, 
            element: <LoginPage />,
            action: loginAction
          },
          { 
            path: ROUTES.REGISTER, 
            element: <RegisterPage />,
            action: registerAction 
          },
          { path: ROUTES.VERIFY_EMAIL, element: <VerifyEmailPage /> }
        ]
      },

      // Protected Routes
      {
        element: <DashboardLayout />,
        children: [
           { 
             path: ROUTES.DASHBOARD, 
             element: <DashboardPage />,
             loader: dashboardLoader
           },
           { 
             path: ROUTES.CREATE_EVENT, 
             element: (
               <RoleBasedRoute requiredRole="ORGANIZER">
                  <CreateEventPage />
               </RoleBasedRoute>
             ),
             action: createEventAction
           },
           { 
             path: "/events/:id/edit", 
             element: (
               <RoleBasedRoute requiredRole="ORGANIZER">
                  <EditEventPage />
               </RoleBasedRoute>
             ),
             loader: eventDetailsLoader, // Reuse loader for editing
             action: editEventAction
           },
           { 
             path: "/events/:id/checkin", 
             element: (
               <RoleBasedRoute requiredRole="ORGANIZER">
                  <CheckInPage />
               </RoleBasedRoute>
             ) 
           },
           { 
             path: "/communities/create", 
             element: (
               <RoleBasedRoute requiredRole="ORGANIZER">
                  <CreateCommunityPage />
               </RoleBasedRoute>
             ),
             action: createCommunityAction
           },
           { 
             path: "/communities/:id", 
             element: <CommunityDetailsPage />,
             loader: communityDetailsLoader
           }
        ]
      },

      // Fallback
      { path: "*", element: <Navigate to={ROUTES.LOGIN} replace /> }
    ]
  }
]);
