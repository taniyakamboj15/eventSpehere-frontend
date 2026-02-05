import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import Button from '../components/Button';
import { Calendar, Users, Sparkles, Menu, X, LogOut, Shield, Search } from 'lucide-react';
import React from 'react';
import { UI_TEXT } from '../constants/text.constants';

const DashboardLayout = () => {
  const { isAuthenticated, isLoading, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const NavItems = () => (
    <>
      <Button 
        variant="ghost" 
        className="w-full justify-start gap-3" 
        onClick={() => { navigate(ROUTES.DASHBOARD); setIsMobileMenuOpen(false); }}
      >
        <Calendar size={18} />
        {UI_TEXT.SIDEBAR_JOINED}
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start gap-3" 
        onClick={() => { navigate(ROUTES.EVENTS); setIsMobileMenuOpen(false); }}
      >
        <Search size={18} />
        {UI_TEXT.SIDEBAR_DISCOVER}
      </Button>

      {/* Organizer Only */}
      {(user?.role === 'ORGANIZER' || user?.role === 'ADMIN') && (
        <>
          <div className="pt-4 pb-2 px-4">
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">{UI_TEXT.SIDEBAR_MANAGEMENT}</span>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3" 
            onClick={() => { navigate(ROUTES.DASHBOARD); setIsMobileMenuOpen(false); }}
          >
            <Users size={18} />
            {UI_TEXT.SIDEBAR_MY_EVENTS}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3" 
            onClick={() => { navigate(ROUTES.CREATE_EVENT); setIsMobileMenuOpen(false); }}
          >
            <Sparkles size={18} />
            {UI_TEXT.SIDEBAR_CREATE_EVENT}
          </Button>
        </>
      )}

      {/* Admin Only */}
      {user?.role === 'ADMIN' && (
        <>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3" 
            onClick={() => { setIsMobileMenuOpen(false); }}
          >
            <Shield size={18} />
            {UI_TEXT.SIDEBAR_ADMIN}
          </Button>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-surface border-b border-border p-4 flex items-center justify-between sticky top-0 z-40">
        <span className="font-bold text-primary">{UI_TEXT.BRAND_NAME}</span>
        <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-surface p-4 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex-1 space-y-2 mt-4">
              <NavItems />
            </div>
            <div className="pt-4 border-t border-border mt-auto pb-4">
              <Button variant="danger" size="sm" className="w-full justify-start gap-3" onClick={signOut}>
                <LogOut size={18} />
                {UI_TEXT.NAV_SIGN_OUT}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-surface border-r border-border p-4 hidden md:flex flex-col sticky top-0 h-screen">
        <h2 className="text-xl font-bold text-primary mb-8 px-2">
          {user?.role === 'ORGANIZER' ? UI_TEXT.ROLE_ORGANIZER : user?.role === 'ADMIN' ? UI_TEXT.ROLE_ADMIN : UI_TEXT.ROLE_DASHBOARD}
        </h2>
        
        <nav className="flex-1 space-y-1">
          <NavItems />
        </nav>

        <div className="pt-4 border-t border-border mt-4">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-error hover:bg-red-50" onClick={signOut}>
            <LogOut size={18} />
            {UI_TEXT.NAV_SIGN_OUT}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-surface border-b border-border">
            <div>
                <h1 className="text-xl font-bold text-text">{UI_TEXT.DASHBOARD_WELCOME}, {user?.name?.split(' ')[0]}!</h1>
                <p className="text-sm text-textSecondary">{UI_TEXT.DASHBOARD_SUBTITLE}</p>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.HOME)}>
                    <Search className="w-4 h-4 mr-2" />
                    {UI_TEXT.BROWSE_EVENTS}
                </Button>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
