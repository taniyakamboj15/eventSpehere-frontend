import { useParams } from 'react-router-dom';
import EventForm from '../features/event/EventForm';
import AttendeeManager from '../features/rsvp/AttendeeManager';
import { useEventManage } from '../hooks/useEventManage';
import StatusHandler from '../components/common/StatusHandler';
import EntityHeader from '../components/common/EntityHeader';
import Button from '../components/common/Button';
import { Edit, Users } from 'lucide-react';

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
        handleDelete
    } = useEventManage(id);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <StatusHandler isLoading={isLoading} isEmpty={!event} emptyTitle="Event not found">
                {event && (
                    <>
                        <EntityHeader 
                            label="Manage Event"
                            title={event.title}
                            backUrl={-1}
                            backLabel="Back to Dashboard"
                            actions={[
                                {
                                    label: 'View Live Page',
                                    onClick: () => window.open(`/events/${event._id}`, '_blank'),
                                    variant: 'outline'
                                }
                            ]}
                        />

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
                   
                   {/* delete */}
                    <div className="pt-6 mt-6 border-t border-border">
                        <p className="px-2 text-xs font-bold text-textSecondary uppercase mb-2">Danger Zone</p>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-all flex items-center gap-3"
                        >
                            Delete
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
                    </>
                )}
            </StatusHandler>
        </div>
    );
};

export default EventManagePage;
