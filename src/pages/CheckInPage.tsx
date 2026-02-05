import AttendeeManager from '../features/rsvp/AttendeeManager';
import { UI_TEXT } from '../constants/text.constants';

const CheckInPage = () => {

    return (
        <div className="container mx-auto max-w-lg py-8">
            <h1 className="text-2xl font-bold text-center mb-6">{UI_TEXT.EVENT_CHECK_IN_TITLE}</h1>
            <AttendeeManager />
        </div>
    );
};

export default CheckInPage;
