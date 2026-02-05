
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { UserRole } from '../types/auth.types';
import { 
    Calendar, MapPin, Users, Sparkles, Store, Shield, 
    Bell, Camera, MessageCircle, Repeat, CheckCircle, Search 
} from 'lucide-react';
import { UseCaseCard } from '../features/home/UseCaseCard';
import { FeatureItem } from '../features/home/FeatureItem';
import { PastEventsSection } from '../features/home/PastEventsSection';
import { UI_TEXT } from '../constants/text.constants';

const HomePage = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* Hero Section */}
            <section className="relative bg-surface border-b border-border py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 -z-10" />
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
                        <Sparkles className="w-4 h-4" />
                        <span>{UI_TEXT.HOME_HERO_BADGE}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-text mb-6 tracking-tight">
                        {UI_TEXT.HOME_HERO_TITLE_PREFIX} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{UI_TEXT.HOME_HERO_TITLE_HIGHLIGHT}</span>
                    </h1>
                    <p className="text-xl text-textSecondary max-w-2xl mx-auto mb-10 leading-relaxed">
                        {UI_TEXT.HOME_HERO_SUBTITLE}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" onClick={() => navigate(ROUTES.EVENTS)}>
                            {UI_TEXT.HOME_HERO_CTA_DISCOVER}
                        </Button>
                        {!isAuthenticated && (
                            <Link to={ROUTES.REGISTER}>
                                <Button size="lg" variant="outline">{UI_TEXT.HOME_HERO_CTA_GET_STARTED}</Button>
                            </Link>
                        )}
                        {isAuthenticated && user?.role === UserRole.ATTENDEE && (
                             <Button size="lg" variant="outline" onClick={() => navigate(ROUTES.DASHBOARD)}>
                                {UI_TEXT.HOME_HERO_CTA_MY_DASHBOARD}
                             </Button>
                        )}
                        {isAuthenticated && (user?.role === UserRole.ORGANIZER || user?.role === UserRole.ADMIN) && (
                             <Button size="lg" variant="outline" onClick={() => navigate(ROUTES.DASHBOARD)}>
                                {UI_TEXT.HOME_HERO_CTA_DASHBOARD}
                             </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-text mb-4">{UI_TEXT.HOME_USE_CASES_TITLE}</h2>
                    <p className="text-textSecondary">{UI_TEXT.HOME_USE_CASES_SUBTITLE}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <UseCaseCard 
                        icon={Users}
                        title={UI_TEXT.HOME_UC_HOA_TITLE}
                        desc={UI_TEXT.HOME_UC_HOA_DESC}
                        color="text-blue-500"
                        bg="bg-blue-50"
                    />
                    <UseCaseCard 
                        icon={Sparkles} 
                        title={UI_TEXT.HOME_UC_HOBBY_TITLE} 
                        desc={UI_TEXT.HOME_UC_HOBBY_DESC}
                        color="text-purple-500"
                        bg="bg-purple-50"
                    />
                    <UseCaseCard 
                        icon={Store} 
                        title={UI_TEXT.HOME_UC_BIZ_TITLE}
                        desc={UI_TEXT.HOME_UC_BIZ_DESC}
                        color="text-orange-500"
                        bg="bg-orange-50"
                    />
                </div>
            </section>

            {/* Past Events / Memories Section */}
            <PastEventsSection />

            {/* Features Grid */}
            <section className="bg-surface py-20 border-y border-border">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-text mb-4">{UI_TEXT.HOME_FEATURES_TITLE}</h2>
                        <p className="text-textSecondary">{UI_TEXT.HOME_FEATURES_SUBTITLE}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureItem icon={Calendar} title={UI_TEXT.HOME_FEAT_CREATION_TITLE} desc={UI_TEXT.HOME_FEAT_CREATION_DESC} />
                        <FeatureItem icon={Shield} title={UI_TEXT.HOME_FEAT_PRIVACY_TITLE} desc={UI_TEXT.HOME_FEAT_PRIVACY_DESC} />
                        <FeatureItem icon={MapPin} title={UI_TEXT.HOME_FEAT_MAPS_TITLE} desc={UI_TEXT.HOME_FEAT_MAPS_DESC} />
                        <FeatureItem icon={Users} title={UI_TEXT.HOME_FEAT_ATTENDEES_TITLE} desc={UI_TEXT.HOME_FEAT_ATTENDEES_DESC} />
                        <FeatureItem icon={Bell} title={UI_TEXT.HOME_FEAT_NOTIFS_TITLE} desc={UI_TEXT.HOME_FEAT_NOTIFS_DESC} />
                        <FeatureItem icon={CheckCircle} title={UI_TEXT.HOME_FEAT_CHECKIN_TITLE} desc={UI_TEXT.HOME_FEAT_CHECKIN_DESC} />
                        <FeatureItem icon={Camera} title={UI_TEXT.HOME_FEAT_GALLERY_TITLE} desc={UI_TEXT.HOME_FEAT_GALLERY_DESC} />
                        <FeatureItem icon={MessageCircle} title={UI_TEXT.HOME_FEAT_DISCUSS_TITLE} desc={UI_TEXT.HOME_FEAT_DISCUSS_DESC} />
                        <FeatureItem icon={Repeat} title={UI_TEXT.HOME_FEAT_RECUR_TITLE} desc={UI_TEXT.HOME_FEAT_RECUR_DESC} />
                        <FeatureItem icon={Search} title={UI_TEXT.HOME_FEAT_DISCOVERY_TITLE} desc={UI_TEXT.HOME_FEAT_DISCOVERY_DESC} />
                        <FeatureItem icon={Calendar} title={UI_TEXT.HOME_FEAT_CALENDAR_TITLE} desc={UI_TEXT.HOME_FEAT_CALENDAR_DESC} />
                    </div>
                </div>
            </section>
            
            {/* Call to Action - Organizer */}
            <section className="container mx-auto px-4">
                <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-center text-white shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">{UI_TEXT.HOME_CTA_TITLE}</h2>
                        <p className="text-blue-100 text-lg">
                            {UI_TEXT.HOME_CTA_DESC}
                        </p>
                        {isAuthenticated ? (
                            user?.role === UserRole.ORGANIZER || user?.role === UserRole.ADMIN ? (
                                <Button size="lg" variant="secondary" onClick={() => navigate(ROUTES.CREATE_EVENT)}>
                                    {UI_TEXT.HOME_CTA_CREATE_EVENT}
                                </Button>
                            ) : (
                                <Button size="lg" variant="secondary" onClick={() => navigate(ROUTES.DASHBOARD)}>
                                    {UI_TEXT.HOME_CTA_BECOME_ORGANIZER}
                                </Button>
                            )
                        ) : (
                            <Link to={ROUTES.REGISTER}>
                                <Button size="lg" variant="secondary">{UI_TEXT.HOME_CTA_SIGN_UP}</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
