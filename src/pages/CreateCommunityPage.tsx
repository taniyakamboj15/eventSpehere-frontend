import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import LocationPicker from '../components/LocationPicker';
import { useCreateCommunity } from '../hooks/useCreateCommunity';
import { useGeocoding } from '../hooks/useGeocoding';
import { toast } from 'react-hot-toast';

const CreateCommunityPage = () => {
    const { 
        register, 
        handleSubmit, 
        setValue, 
        watch, 
        errors, 
        isSubmitting, 
        onSubmit,
        CommunityType 
    } = useCreateCommunity();

    const { searchAddress, isLoading: isGeocoding } = useGeocoding();
    const [searchQuery, setSearchQuery] = useState('');
    const [mapPosition, setMapPosition] = useState<{lat: number, lng: number} | null>(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        const coords = await searchAddress(searchQuery);
        if (coords) {
            setValue('latitude', coords.lat);
            setValue('longitude', coords.lng);
            setMapPosition(coords);
            toast.success('Location found');
        } else {
            toast.error('Location not found');
        }
    };

    const handleLocationSelect = (pos: { lat: number; lng: number }) => {
        setValue('latitude', pos.lat);
        setValue('longitude', pos.lng);
        setMapPosition(pos);
    };

    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <h1 className="text-3xl font-bold text-text mb-2">Start a Community</h1>
            <p className="text-textSecondary mb-8">Create a space for your neighborhood, hobby group, or business.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-surface p-8 rounded-2xl border border-border shadow-sm">
                <Input
                    label="Community Name"
                    name="name"
                    register={register}
                    error={errors.name}
                    placeholder="e.g. Downtown Runners, Elm Street Neighbors"
                />

                <Select
                    label="Type"
                    name="type"
                    register={register}
                    error={errors.type}
                    options={[
                        { value: CommunityType.NEIGHBORHOOD, label: 'Neighborhood (Private)' },
                        { value: CommunityType.HOBBY, label: 'Hobby/Interest (Public)' },
                        { value: CommunityType.BUSINESS, label: 'Local Business (Promotional)' },
                    ]}
                />

                <Textarea
                    label="Description"
                    name="description"
                    register={register}
                    error={errors.description}
                    placeholder="What is this community about?"
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-textSecondary">Location Center</label>
                    <div className="flex gap-2 mb-2">
                        <input 
                            type="text"
                            placeholder="Search area (e.g. 'Central Park, NY')"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSearch();
                                }
                            }}
                        />
                        <button 
                            type="button"
                            onClick={handleSearch}
                            disabled={isGeocoding}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            {isGeocoding ? 'Searching...' : 'Find'}
                        </button>
                    </div>
                    <div className="h-64 rounded-xl overflow-hidden border border-border">
                        <LocationPicker 
                            onChange={handleLocationSelect}
                            forcePosition={mapPosition}
                        />
                    </div>
                     <p className="text-xs text-textSecondary mt-1">
                        Lat: {watch('latitude')?.toFixed(4)}, 
                        Lng: {watch('longitude')?.toFixed(4)}
                    </p>
                    {errors.latitude && <p className="text-error text-sm">Location is required</p>}
                </div>

                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                    Create Community
                </Button>
            </form>
        </div>
    );
};

export default CreateCommunityPage;
