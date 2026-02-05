import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { ROUTES } from '../constants/routes';

export const RoleBasedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole: 'ATTENDEE' | 'ORGANIZER' | 'ADMIN' }) => {
    const { user, isLoading } = useSelector((state: RootState) => state.auth);
    
    if (isLoading) return null; 
    
    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (requiredRole === 'ORGANIZER' && user.role !== 'ORGANIZER' && user.role !== 'ADMIN') {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    if (requiredRole === 'ADMIN' && user.role !== 'ADMIN') {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
    
    return children;
};
