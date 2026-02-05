import { useLocation } from 'react-router-dom';
import EventForm from '../features/event/EventForm';

const CreateEventPage = () => {
    const location = useLocation();
    const initialCommunityId = location.state?.communityId;

    return (
        <div className="container mx-auto max-w-3xl py-8">
            <h1 className="text-3xl font-bold text-text mb-2 text-center">Host an Event</h1>
            <p className="text-textSecondary text-center mb-8">Fill in the details to create your community event.</p>
            <EventForm initialCommunityId={initialCommunityId} />
        </div>
    );
};

export default CreateEventPage;
