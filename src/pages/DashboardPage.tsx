import { useAuth } from '../hooks/useAuth';
import OrganizerDashboard from './OrganizerDashboard';
import { AttendeeDashboard } from '../features/user/AttendeeDashboard';
import { AdminDashboard } from '../features/admin/AdminDashboard';
import { UserRole } from '../types/auth.types';
import Button from '../components/Button';

const DashboardPage = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-textSecondary">Loading your dashboard...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-surface rounded-2xl border border-border p-12 text-center max-w-2xl mx-auto shadow-sm">
                <h2 className="text-2xl font-bold text-text mb-4">Session Expired</h2>
                <p className="text-textSecondary mb-8">Please log in again to access your dashboard features.</p>
                <div className="flex justify-center">
                    <a href="/login">
                        <Button>Go to Login</Button>
                    </a>
                </div>
            </div>
        );
    }

    if (user.role === UserRole.ADMIN) {
        return <AdminDashboard />;
    }

    if (user.role === UserRole.ORGANIZER) {
        return <OrganizerDashboard />;
    }

    // Default: Attendee View
    return <AttendeeDashboard />;
};

export default DashboardPage;
