import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import Button from '../components/common/Button';
import NotificationDropdown from '../components/notification/NotificationDropdown';
import { UI_TEXT } from '../constants/text.constants';

const MainLayout = () => {
  const { isAuthenticated, user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={ROUTES.HOME} className="text-xl font-bold text-primary">
            {UI_TEXT.BRAND_NAME}
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to={ROUTES.EVENTS} className="text-text hover:text-primary transition-colors">
              {UI_TEXT.NAV_DISCOVER}
            </Link>
            {isAuthenticated ? (
              <>
                <Link to={ROUTES.DASHBOARD} className="text-text hover:text-primary transition-colors">
                  {UI_TEXT.NAV_DASHBOARD}
                </Link>
                <div className="flex items-center gap-4">
                  <NotificationDropdown />
                  <span className="text-sm font-medium text-textSecondary">
                    {user?.name}
                  </span>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    {UI_TEXT.NAV_SIGN_OUT}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">{UI_TEXT.NAV_SIGN_IN}</Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button size="sm">{UI_TEXT.NAV_GET_STARTED}</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-surface border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-20">
            <div className="grid md:grid-cols-4 gap-12">
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-primary tracking-tighter">{UI_TEXT.BRAND_NAME}</h3>
                    <p className="text-textSecondary text-base leading-relaxed font-medium">
                        {UI_TEXT.FOOTER_TAGLINE}
                    </p>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-text uppercase tracking-widest text-xs">{UI_TEXT.FOOTER_PLATFORM}</h4>
                    <ul className="space-y-4 text-sm text-textSecondary font-medium">
                        <li><Link to={ROUTES.EVENTS} className="hover:text-primary transition-colors">{UI_TEXT.NAV_DISCOVER}</Link></li>
                        <li><Link to={ROUTES.HOME} className="hover:text-primary transition-colors">{UI_TEXT.FOOTER_FEATURES}</Link></li>
                        <li><Link to={ROUTES.HOME} className="hover:text-primary transition-colors">{UI_TEXT.FOOTER_PRICING}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-text uppercase tracking-widest text-xs">{UI_TEXT.FOOTER_COMMUNITY}</h4>
                    <ul className="space-y-4 text-sm text-textSecondary font-medium">
                        <li><Link to={ROUTES.REGISTER} className="hover:text-primary transition-colors">{UI_TEXT.FOOTER_SIGN_UP}</Link></li>
                        <li><Link to={ROUTES.DASHBOARD} className="hover:text-primary transition-colors">{UI_TEXT.FOOTER_BECOME_ORGANIZER}</Link></li>
                        <li><a href="#" className="hover:text-primary transition-colors">{UI_TEXT.FOOTER_GUIDELINES}</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-bold mb-6 text-text uppercase tracking-widest text-xs">{UI_TEXT.FOOTER_CONTACT}</h4>
                    <ul className="space-y-4 text-sm text-textSecondary font-medium">
                        <li className="hover:text-primary transition-colors cursor-pointer">support@eventsphere.com</li>
                        <li className="hover:text-primary transition-colors cursor-pointer">Twitter @EventSphere</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-border mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-textSecondary text-sm font-medium">
                 <div>&copy; {new Date().getFullYear()} {UI_TEXT.FOOTER_COPYRIGHT}</div>
                 <div className="flex gap-8">
                     <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                     <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                 </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
