const EventCardSkeleton = () => {
    return (
        <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col h-full animate-pulse">
            {/* Image Skeleton */}
            <div className="h-52 bg-gray-200" />
            
            {/* Content Skeleton */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-full mb-6" />
                
                <div className="mt-auto space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
            </div>
        </div>
    );
};

export default EventCardSkeleton;
