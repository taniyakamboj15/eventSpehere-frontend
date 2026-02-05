import { useState } from 'react';
import { EventCategory } from '../types/event.types';
import EventCard from '../components/EventCard';
import { Loader2, Search, Calendar, MapPin } from 'lucide-react';
import CommunityList from '../features/community/CommunityList';
import { useDiscoverEvents } from '../hooks/useDiscoverEvents';

const DiscoverPage = () => {
  const { 
      events, 
      isLoading, 
      error, 
      filters, 
      setFilters, 
      handleLocationClick, 
      clearLocation 
  } = useDiscoverEvents();
  
  const [activeTab, setActiveTab] = useState<'events' | 'communities'>('events');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
             {/* Header */}
             <div className="bg-surface border-b border-border sticky top-0 z-30">
                 <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                     <h1 className="text-2xl font-black text-text">Discover</h1>
                     {/* Tab Switcher */}
                     <div className="flex bg-gray-100 p-1 rounded-xl">
                         <button 
                             className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'events' ? 'bg-white shadow text-primary' : 'text-textSecondary hover:text-text'}`}
                             onClick={() => setActiveTab('events')}
                         >
                             Events
                         </button>
                         <button 
                             className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'communities' ? 'bg-white shadow text-primary' : 'text-textSecondary hover:text-text'}`}
                             onClick={() => setActiveTab('communities')}
                         >
                             Communities
                         </button>
                     </div>
                 </div>
                 
                 {activeTab === 'events' && (
                     <div className="container mx-auto px-4 pb-4 overflow-x-auto no-scrollbar">
                        <div className="flex gap-2">
                             <button
                                 onClick={() => setFilters(prev => ({ ...prev, category: null }))}
                                 className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors ${
                                     filters.category === null 
                                     ? 'bg-primary text-white' 
                                     : 'bg-white border border-border text-textSecondary hover:bg-gray-50'
                                 }`}
                             >
                                 All
                             </button>
                             {Object.values(EventCategory).map((category) => (
                                 <button
                                     key={category}
                                     onClick={() => setFilters(prev => ({ ...prev, category }))}
                                     className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors ${
                                         filters.category === category 
                                         ? 'bg-primary text-white' 
                                         : 'bg-white border border-border text-textSecondary hover:bg-gray-50'
                                     }`}
                                 >
                                     {category}
                                 </button>
                             ))}
                         </div>
                     </div>
                 )}
             </div>

             <div className="container mx-auto px-4 py-8">
                 {activeTab === 'events' ? (
                     <>
                        {/* Search & Header Section */}
                        <div className="relative rounded-[2.5rem] overflow-hidden bg-surface border border-border/60 shadow-xl shadow-primary/5 p-8 md:p-16 mb-8">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-50" />
                            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl opacity-50" />
                            
                            <div className="relative z-10 max-w-3xl">
                            <h1 className="text-4xl md:text-6xl font-black text-text mb-6 tracking-tight">
                                Discover What's <span className="text-primary italic">Happening</span>
                            </h1>
                            <p className="text-lg text-textSecondary mb-10 leading-relaxed max-w-xl">
                                Explore workshops, meetups, and local events specifically curated for your community interests.
                            </p>
                            
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1 group">
                                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur group-focus-within:opacity-100 opacity-0 transition-opacity duration-300" />
                                <div className="relative flex items-center bg-white rounded-2xl border border-border/80 focus-within:border-primary transition-all duration-300 overflow-hidden shadow-sm">
                                    <Search className="ml-5 w-6 h-6 text-textSecondary group-focus-within:text-primary transition-colors" />
                                    <input 
                                    type="text" 
                                    placeholder="Search by title..." 
                                    className="w-full pl-4 pr-6 py-5 text-lg text-text placeholder:text-textSecondary/60 focus:outline-none"
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    />
                                </div>
                                </div>
                                
                                <button 
                                type="button" 
                                onClick={handleLocationClick}
                                className={`px-6 py-5 border font-bold rounded-2xl transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                                    filters.location 
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                                    : 'bg-white border-border/60 text-text hover:bg-gray-50 hover:shadow-lg'
                                }`}
                                >
                                <MapPin className={`w-5 h-5 ${filters.location ? 'text-white' : 'text-primary'}`} />
                                {filters.location ? (filters.location.name || 'Nearby') : 'Near Me'}
                                </button>
                                
                                {filters.location && (
                                     <button
                                        type="button"
                                        onClick={clearLocation}
                                        className="px-4 py-5 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all"
                                     >
                                         Clear
                                     </button>
                                )}
                            </form>
                            </div>
                        </div>

                        {/* Results Header */}
                        <div className="flex items-center justify-between px-2 mb-6">
                            <h2 className="text-2xl font-black text-text">
                            {events.length} Upcoming Events
                            </h2>
                            <div className="flex gap-2">
                            {/* Add mini-filters here if needed */}
                            <span className="text-xs font-bold text-textSecondary uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full border border-border/40">Latest</span>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
                        ) : error ? (
                            <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
                                <p className="text-red-600 font-bold text-lg mb-2">Oops! Something went wrong</p>
                                <p className="text-red-400">{error}</p>
                            </div>
                        ) : events.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                                <Calendar className="w-16 h-16 mx-auto mb-6 text-gray-200" />
                                <h3 className="text-2xl font-black text-text mb-2">No events found</h3>
                                <p className="text-textSecondary">Try adjusting your search terms or check back later.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {events.map((event) => (
                                    <EventCard key={event._id} event={event} />
                                ))}
                            </div>
                        )}
                        
                        {isLoading && events.length > 0 && (
                            <div className="py-8 flex justify-center">
                                <Loader2 className="animate-spin text-primary w-8 h-8" />
                            </div>
                        )}
                     </>
                 ) : (
                     <div className="max-w-6xl mx-auto">
                        <CommunityList />
                     </div>
                 )}
             </div>
        </div>
  );
};

export default DiscoverPage;
