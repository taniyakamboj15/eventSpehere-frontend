import AttendeeManager from '../features/rsvp/AttendeeManager';

const CheckInPage = () => {

    return (
        <div className="container mx-auto max-w-lg py-8">
            <h1 className="text-2xl font-bold text-center mb-6">Event Check-in</h1>
            <AttendeeManager />
        </div>
    );
};

export default CheckInPage;
