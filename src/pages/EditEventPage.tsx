import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi } from '../services/api/event.api';
import type { IEvent } from '../types/event.types';
import EventForm from '../features/event/EventForm';
import { Loader2 } from 'lucide-react';
import { ROUTES } from '../constants/routes';

const EditEventPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<IEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            try {
                const data = await eventApi.getById(id);
                setEvent(data);
            } catch (error) {
                console.error('Failed to load event', error);
                navigate(ROUTES.DASHBOARD);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [id, navigate]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
        );
    }

    if (!event) return null;

    return (
        <div className="container mx-auto px-4 py-8">
             <div className="max-w-2xl mx-auto mb-6">
                <button 
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                    className="text-sm text-textSecondary hover:underline"
                >
                    &larr; Back to Dashboard
                </button>
             </div>
            <EventForm initialData={event} isEditing={true} />
        </div>
    );
};

export default EditEventPage;
