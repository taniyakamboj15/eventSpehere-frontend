import { useParams } from 'react-router-dom';
import EventForm from '../features/event/EventForm';
import AttendeeManager from '../features/rsvp/AttendeeManager';
import Button from '../components/Button';
import { Loader2, ArrowLeft, Edit, Users } from 'lucide-react';
import { useEventManage } from '../hooks/useEventManage';

const EventManagePage = () => {
    const { id } = useParams<{ id: string }>();
    const { 
        event, 
        isLoading, 
        activeTab, 
        setActiveTab, 
        showDeleteModal, 
        setShowDeleteModal, 
        isDeleting, 
        handleDelete, 
        navigate 
    } = useEventManage(id);

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
    if (!event) return <div className="text-center py-20">Event not found</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Button variant="ghost" className="mb-6 pl-0 gap-2 hover:bg-transparent" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Button>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <span className="text-sm font-bold text-primary uppercase tracking-wider mb-1 block">Manage Event</span>
                    <h1 className="text-3xl font-black text-text">{event.title}</h1>
                </div>
                <div className="flex gap-3">
                     <Button variant="outline" onClick={() => window.open(`/events/${event._id}`, '_blank')}>
                        View Live Page
                     </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${
                            activeTab === 'details' 
                            ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                            : 'bg-surface text-textSecondary hover:bg-gray-50 border border-border'
                        }`}
                    >
                        <Edit className="w-4 h-4" /> Edit Details
                    </button>
                    <button
                        onClick={() => setActiveTab('attendees')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${
                            activeTab === 'attendees' 
                            ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                            : 'bg-surface text-textSecondary hover:bg-gray-50 border border-border'
                        }`}
                    >
                        <Users className="w-4 h-4" /> Attendees
                    </button>
                   
                   {/* Danger Zone */}
                    <div className="pt-6 mt-6 border-t border-border">
                        <p className="px-2 text-xs font-bold text-textSecondary uppercase mb-2">Danger Zone</p>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-all flex items-center gap-3"
                        >
                            Delete Event
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-surface rounded-3xl border border-border shadow-sm p-6 md:p-8 min-h-[600px]">
                        {activeTab === 'details' ? (
                            <EventForm initialData={event} isEditing={true} />
                        ) : (
                            <AttendeeManager eventId={event._id} />
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <h3 className="text-2xl font-black text-text mb-2">Delete Event?</h3>
                        <p className="text-textSecondary mb-6">
                            Are you sure you want to delete <span className="font-bold text-text">{event.title}</span>? 
                            This action cannot be undone and all RSVP data will be lost.
                        </p>
                        
                        <div className="flex gap-3 justify-end">
                            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </Button>
                            <Button 
                                className="bg-red-600 hover:bg-red-700 text-white border-transparent"
                                isLoading={isDeleting}
                                onClick={handleDelete}
                            >
                                Delete Forever
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventManagePage;
