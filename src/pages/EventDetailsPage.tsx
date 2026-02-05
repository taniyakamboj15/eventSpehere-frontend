import { useParams } from 'react-router-dom';
import { Loader2, Calendar, MapPin, Camera, Settings } from 'lucide-react';
import { format } from 'date-fns';
import RSVPButton from '../components/RSVPButton';
import CommentSection from '../features/comment/CommentSection';
import EventMap from '../components/EventMap';
import ImageUpload from '../components/ImageUpload';
import { useEventDetails } from '../hooks/useEventDetails';

const EventDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { 
        event, 
        isLoading, 
        userRsvpStatus, 
        imageError, 
        setImageError, 
        handleRsvpChange, 
        scrollToMap, 
        handlePhotoUpload,
        permissions 
    } = useEventDetails(id);

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
    if (!event) return <div className="text-center py-20">Event not found</div>;

    const { canManage, canUpload } = permissions;

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Full-width Banner Header */}
            <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
                {event.photos && event.photos.length > 0 && !imageError ? (
                    <img 
                        src={event.photos[0]} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <Calendar className="w-20 h-20 text-primary opacity-20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="container mx-auto max-w-6xl">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                    {event.category}
                                </span>
                                <span className={`px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider border border-white/10`}>
                                    {event.visibility}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-sm">
                                {event.title}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl py-8 md:py-12 px-4 md:px-6">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-border/60">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-textSecondary uppercase tracking-wider mb-1">When</h4>
                                        <p className="text-text font-semibold">{format(new Date(event.startDateTime), 'PPPP')}</p>
                                        <p className="text-textSecondary text-sm">{format(new Date(event.startDateTime), 'p')} – {format(new Date(event.endDateTime), 'p')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-textSecondary uppercase tracking-wider mb-1">Where</h4>
                                        <p className="text-text font-semibold">{event.location.address}</p>
                                        <button 
                                            onClick={scrollToMap}
                                            className="text-primary text-sm font-bold hover:underline mt-1"
                                        >
                                            View on Map
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-lg max-w-none text-textSecondary">
                                <h3 className="text-2xl font-black text-text mb-4">Event Description</h3>
                                <div className="leading-relaxed whitespace-pre-wrap">
                                    {event.description}
                                </div>
                            </div>
                        </div>

                        <div id="event-location-map" className="bg-surface p-8 rounded-3xl border border-border shadow-sm">
                            <h3 className="text-2xl font-black text-text mb-6">Location</h3>
                            <EventMap 
                                latitude={event.location.coordinates[1]} 
                                longitude={event.location.coordinates[0]} 
                                address={event.location.address} 
                            />
                        </div>

                        {/* Shared Gallery */}
                        <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm">
                             <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-text">Photo Gallery</h3>
                             </div>

                             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {/* Upload Button Card */}
                                {canUpload && (
                                     <div className="aspect-square rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors flex items-center justify-center relative overflow-hidden group">
                                         <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/50">
                                             <span className="text-white font-bold text-sm">Add Photo</span>
                                         </div>
                                         <div className="text-center p-4">
                                             <Camera className="w-8 h-8 text-primary mx-auto mb-2" />
                                             <span className="text-xs font-bold text-primary uppercase tracking-wide">Add Memory</span>
                                         </div>
                                         {/* Hidden ImageUpload overlay */}
                                         <div className="absolute inset-0 z-20 opacity-0">
                                             <ImageUpload 
                                                onUpload={handlePhotoUpload}
                                                className="w-full h-full"
                                             />
                                         </div>
                                     </div>
                                )}

                                {event.photos && event.photos.map((photo, index) => (
                                    <div key={index} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group relative">
                                        <img src={photo} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    </div>
                                ))}
                                
                                {(!event.photos || event.photos.length === 0) && !permissions.isEventEnded && (
                                    <div className="col-span-full py-8 text-center text-textSecondary bg-gray-50 rounded-xl border border-dashed border-border">
                                        No photos yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm">
                            <CommentSection eventId={event._id} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 sticky top-24">
                        <div className="bg-surface p-8 rounded-3xl border border-border shadow-xl relative overflow-hidden">
                             {/* Decorative background element */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                            
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-xl font-black text-primary">
                                    {typeof event.organizer === 'string' ? 'O' : event.organizer.name.charAt(0)}
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-textSecondary uppercase tracking-widest mb-0.5">Organized by</span>
                                    <span className="font-black text-lg text-text">
                                        {typeof event.organizer === 'string' ? 'Organizer' : event.organizer.name}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {canManage && (
                                    <a 
                                        href={`/events/${event._id}/manage`}
                                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-900/20 mb-4"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Manage Event
                                    </a>
                                )}
                                <RSVPButton 
                                    eventId={event._id} 
                                    currentStatus={userRsvpStatus}
                                    onStatusChange={handleRsvpChange}
                                    isFull={event.attendeeCount >= event.capacity}
                                />
                                
                                {event.googleCalendarLink && (
                                    <a 
                                        href={event.googleCalendarLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-border rounded-xl text-sm font-bold transition-all"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        Add to Calendar
                                    </a>
                                )}
                            </div>

                            <div className="mt-8 pt-8 border-t border-border/60">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold text-textSecondary uppercase">Attendees</span>
                                    <span className="text-xs font-black bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                                        {event.attendeeCount} / {event.capacity}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-primary h-full transition-all duration-1000" 
                                        style={{ width: `${Math.min(100, (event.attendeeCount / event.capacity) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default EventDetailsPage;
