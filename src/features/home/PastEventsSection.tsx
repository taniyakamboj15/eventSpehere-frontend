import { usePastEvents } from '../../hooks/event/usePastEvents';
import { UI_TEXT } from '../../constants/text.constants';

export const PastEventsSection = () => {
    const { events } = usePastEvents();

    if (events.length === 0) return null;

    return (
        <section className="container mx-auto px-4 py-16 border-t border-border">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-text mb-2">{UI_TEXT.PAST_EVENTS_TITLE}</h2>
                <p className="text-textSecondary">{UI_TEXT.PAST_EVENTS_SUBTITLE}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {events.map((event) => (
                    <div key={event._id} className="group relative aspect-square rounded-2xl overflow-hidden">
                        {event.photos?.[0] ? (
                            <img src={event.photos[0]} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-textSecondary text-xs font-bold uppercase">{UI_TEXT.NO_IMAGE}</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                            <h4 className="text-white font-bold truncate">{event.title}</h4>
                             <p className="text-white/70 text-xs">
                                {new Date(event.endDateTime).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
