
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
                        <span>The Ultimate Community Platform</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-text mb-6 tracking-tight">
                        Connect with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Community</span>
                    </h1>
                    <p className="text-xl text-textSecondary max-w-2xl mx-auto mb-10 leading-relaxed">
                        Discover local events, join neighborhood associations, and connect with hobby groups. 
                        EventSphere brings people together in the real world.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" onClick={() => navigate(ROUTES.EVENTS)}>
                            Discover Events
                        </Button>
                        {!isAuthenticated && (
                            <Link to={ROUTES.REGISTER}>
                                <Button size="lg" variant="outline">Get Started</Button>
                            </Link>
                        )}
                        {isAuthenticated && user?.role === UserRole.ATTENDEE && (
                             <Button size="lg" variant="outline" onClick={() => navigate(ROUTES.DASHBOARD)}>
                                My Dashboard
                             </Button>
                        )}
                        {isAuthenticated && (user?.role === UserRole.ORGANIZER || user?.role === UserRole.ADMIN) && (
                             <Button size="lg" variant="outline" onClick={() => navigate(ROUTES.DASHBOARD)}>
                                Dashboard
                             </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-text mb-4">Designed for Every Community</h2>
                    <p className="text-textSecondary">Whether you are a neighbor, a hobbyist, or a business owner.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <UseCaseCard 
                        icon={Users}
                        title="Neighborhood Associations" 
                        desc="Manage HOA meetings, block parties, and local updates with private community events."
                        color="text-blue-500"
                        bg="bg-blue-50"
                    />
                    <UseCaseCard 
                        icon={Sparkles} 
                        title="Hobby Groups" 
                        desc="Organize weekly meetups for hiking, gaming, book clubs, and shared interests."
                        color="text-purple-500"
                        bg="bg-purple-50"
                    />
                    <UseCaseCard 
                        icon={Store} 
                        title="Local Businesses" 
                        desc="Promote grand openings, sales, and workshops to your local audience."
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
                        <h2 className="text-3xl font-bold text-text mb-4">Everything You Need</h2>
                        <p className="text-textSecondary">Powerful features to manage successful events.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureItem icon={Calendar} title="Event Creation" desc="Easy scheduling with date, time, and capacity limits." />
                        <FeatureItem icon={Shield} title="Privacy Controls" desc="Public, Community-only, or Private Invite visibility." />
                        <FeatureItem icon={MapPin} title="Interactive Maps" desc="Find events near you with geolocation." />
                        <FeatureItem icon={Users} title="Attendee Management" desc="Track RSVPs and manage guest lists." />
                        <FeatureItem icon={Bell} title="Smart Notifications" desc="Automated email updates for attendees." />
                        <FeatureItem icon={CheckCircle} title="Event Check-in" desc="Seamless QR or manual check-in on event day." />
                        <FeatureItem icon={Camera} title="Photo Gallery" desc="Share memories from past events." />
                        <FeatureItem icon={MessageCircle} title="Discussions" desc="Q&A section for every event." />
                        <FeatureItem icon={Repeat} title="Recurring Events" desc="Schedule weekly or monthly meetups easily." />
                        <FeatureItem icon={Search} title="Discovery" desc="Interest-based search and categories." />
                        <FeatureItem icon={Calendar} title="Calendar Sync" desc="Add events directly to Google Calendar." />
                    </div>
                </div>
            </section>

            {/* Call to Action - Organizer */}
            <section className="container mx-auto px-4">
                <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-center text-white shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">Ready to Lead Your Community?</h2>
                        <p className="text-blue-100 text-lg">
                            Become an organizer today to access advanced tools, analytics, and community management features.
                            Admins review every application to ensure quality.
                        </p>
                        {isAuthenticated ? (
                            user?.role === UserRole.ORGANIZER || user?.role === UserRole.ADMIN ? (
                                <Button size="lg" variant="secondary" onClick={() => navigate(ROUTES.CREATE_EVENT)}>
                                    Create Event
                                </Button>
                            ) : (
                                <Button size="lg" variant="secondary" onClick={() => navigate(ROUTES.DASHBOARD)}>
                                    Become an Organizer
                                </Button>
                            )
                        ) : (
                            <Link to={ROUTES.REGISTER}>
                                <Button size="lg" variant="secondary">Sign Up Now</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
