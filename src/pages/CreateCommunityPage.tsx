import { useState } from 'react';
import Input from '../components/forms/Input';
import Button from '../components/common/Button';
import Select from '../components/forms/Select';
import Textarea from '../components/forms/Textarea';
import LocationPicker from '../components/location-picker/LocationPicker';
import { useCreateCommunity } from '../hooks/useCreateCommunity';
import { useGeocoding } from '../hooks/useGeocoding';
import { toast } from 'react-hot-toast';
import { UI_TEXT } from '../constants/text.constants';

const CreateCommunityPage = () => {
    const { 
        register, 
        handleSubmit, 
        setValue, 
        watch, 
        errors, 
        isSubmitting, 
        serverError,
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
            toast.success(UI_TEXT.MSG_LOCATION_FOUND);
        } else {
            toast.error(UI_TEXT.MSG_LOCATION_NOT_FOUND);
        }
    };

    const handleLocationSelect = (pos: { lat: number; lng: number }) => {
        setValue('latitude', pos.lat);
        setValue('longitude', pos.lng);
        setMapPosition(pos);
    };

    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <h1 className="text-3xl font-bold text-text mb-2">{UI_TEXT.TITLE_START_COMMUNITY}</h1>
            <p className="text-textSecondary mb-8">{UI_TEXT.SUBTITLE_START_COMMUNITY}</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-surface p-8 rounded-2xl border border-border shadow-sm">
                {serverError && (
                    <div className="bg-red-50 text-error p-3 rounded-lg text-sm text-center">
                        {serverError}
                    </div>
                )}
                <Input
                    label={UI_TEXT.LABEL_COMMUNITY_NAME}
                    name="name"
                    register={register}
                    error={errors.name}
                    placeholder={UI_TEXT.PLACEHOLDER_COMMUNITY_NAME}
                />

                <Select
                    label={UI_TEXT.LABEL_TYPE}
                    name="type"
                    register={register}
                    error={errors.type}
                    options={[
                        { value: CommunityType.NEIGHBORHOOD, label: UI_TEXT.LABEL_NEIGHBORHOOD_PRIVATE },
                        { value: CommunityType.HOBBY, label: UI_TEXT.LABEL_HOBBY_PUBLIC },
                        { value: CommunityType.BUSINESS, label: UI_TEXT.LABEL_BUSINESS_PROMOTIONAL },
                    ]}
                />

                <Textarea
                    label={UI_TEXT.LABEL_DESCRIPTION}
                    name="description"
                    register={register}
                    error={errors.description}
                    placeholder={UI_TEXT.PLACEHOLDER_COMMUNITY_DESC}
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-textSecondary">{UI_TEXT.LABEL_LOCATION_CENTER}</label>
                    <div className="flex gap-2 mb-2">
                        <input 
                            type="text"
                            placeholder={UI_TEXT.PLACEHOLDER_SEARCH_AREA}
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
                            {isGeocoding ? UI_TEXT.LABEL_SEARCHING : UI_TEXT.LABEL_FIND_LOCATION}
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
                    {errors.latitude && <p className="text-error text-sm">{UI_TEXT.MSG_LOCATION_REQUIRED}</p>}
                </div>

                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                    Create Community
                </Button>
            </form>
        </div>
    );
};

export default CreateCommunityPage;
