import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import type { EventFormData } from '../../validators/event.schema';
import type { IEvent } from '../../types/event.types';
import { EventCategory, EventVisibility } from '../../types/event.types';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import Button from '../../components/Button';
import ImageUpload from '../../components/ImageUpload';
import LocationPicker from '../../components/LocationPicker';
import { UI_TEXT, BUTTON_TEXT } from '../../constants/text.constants';
import { useEventForm } from '../../hooks/event/useEventForm';
import { useGeocoding } from '../../hooks/useGeocoding';
import { toast } from 'react-hot-toast';

interface EventFormProps {
    initialData?: IEvent;
    isEditing?: boolean;
    initialCommunityId?: string;
}

const EventForm = ({ initialData, isEditing = false, initialCommunityId }: EventFormProps) => {
    const {
        form,
        imageUrl,
        setImageUrl,
        communities,
        visibility,
        watchCommunityId,
        isRecurring,
        isCommunityOnly,
        latitude,
        longitude,
        getError,
        onSubmit
    } = useEventForm({ initialData, isEditing, initialCommunityId });

    const {
        register,
        setValue,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = form;

    const { searchAddress } = useGeocoding();
    const [mapPosition, setMapPosition] = useState<{lat: number, lng: number} | null>(
        latitude && longitude ? { lat: Number(latitude), lng: Number(longitude) } : null
    );

    const handleAddressBlur = async () => {
        const address = getValues('location.address');
        if (address) {
            const coords = await searchAddress(address);
            if (coords) {
                setValue('location.latitude', coords.lat);
                setValue('location.longitude', coords.lng);
                setMapPosition(coords);
                toast.success('Location found on map');
            }
        }
    };

    const handleLocationSelect = async (pos: { lat: number; lng: number }) => {
        setValue('location.latitude', pos.lat);
        setValue('location.longitude', pos.lng);
        setMapPosition(pos); // Sync internal state
        
        // Optional: Reverse geocode to fill address if empty or user wants it
        // For now, let's not overwrite unless we want that specific behavior. 
        // User said "user can also select himself", implying manual override.
    };

    return (
        <form onSubmit={handleSubmit(onSubmit as SubmitHandler<EventFormData>)} className="space-y-6 max-w-2xl mx-auto bg-surface p-8 rounded-xl border border-border shadow-sm mb-12">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-text">{isEditing ? UI_TEXT.EDIT_EVENT_TITLE : UI_TEXT.CREATE_EVENT_TITLE}</h2>
                <p className="text-textSecondary text-sm">{isEditing ? UI_TEXT.EDIT_EVENT_SUBTITLE : UI_TEXT.CREATE_EVENT_SUBTITLE}</p>
            </div>

            <Input
                label={UI_TEXT.EVENT_TITLE_LABEL}
                name="title"
                type="text"
                register={register}
                error={errors.title}
                placeholder={UI_TEXT.EVENT_TITLE_PLACEHOLDER}
            />

            <div className="mb-6">
                 <label className="block text-sm font-medium text-textSecondary mb-2">{UI_TEXT.COVER_IMAGE_LABEL}</label>
                 <ImageUpload onUpload={setImageUrl} defaultImage={imageUrl} />
            </div>

            <Textarea
                label={UI_TEXT.DESCRIPTION_LABEL}
                name="description"
                register={register}
                error={errors.description}
                placeholder={UI_TEXT.DESCRIPTION_PLACEHOLDER}
                rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label={UI_TEXT.CATEGORY_LABEL}
                    name="category"
                    register={register}
                    error={errors.category}
                    options={Object.values(EventCategory).map(c => ({ value: c, label: c }))}
                />

                {/* Visibility & Community Selection */}
                <div className="space-y-4 md:col-span-2">
                     <Select
                        label={UI_TEXT.VISIBILITY_LABEL}
                        name="visibility"
                        register={register}
                        error={errors.visibility}
                        options={[
                            { value: EventVisibility.PUBLIC, label: UI_TEXT.PUBLIC_OPTION },
                            { value: EventVisibility.COMMUNITY_ONLY, label: UI_TEXT.COMMUNITY_ONLY_OPTION },
                            { value: EventVisibility.PRIVATE_INVITE, label: UI_TEXT.PRIVATE_OPTION },
                        ]}
                    />

                    {/* Show Community Select if we have communities */}
                    {visibility === EventVisibility.COMMUNITY_ONLY && communities.length > 0 && (
                        <div className="form-control w-full">
                            <label className="label block text-sm font-medium text-textSecondary mb-2">
                                <span className="label-text">{UI_TEXT.HOST_COMMUNITY_LABEL}</span>
                            </label>
                            <select 
                                {...register('communityId')}
                                className="select select-bordered w-full p-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            >
                                <option value="">{UI_TEXT.SELECT_COMMUNITY_PLACEHOLDER}</option>
                                {communities.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.communityId && <p className="text-red-500 text-xs mt-1">{errors.communityId.message}</p>}
                        </div>
                    )}

                    {/* Invite Emails Input */}
                    {(visibility === EventVisibility.PRIVATE_INVITE || visibility === EventVisibility.PUBLIC || visibility === EventVisibility.COMMUNITY_ONLY) && (
                         <div className="form-control w-full"> 
                             {/* Always allow inviting, but enforce for PRIVATE */}
                             <Textarea
                                label={visibility === EventVisibility.PRIVATE_INVITE ? UI_TEXT.INVITE_EMAILS_LABEL_REQUIRED : UI_TEXT.INVITE_EMAILS_LABEL_OPTIONAL}
                                name="inviteEmails"
                                register={register}
                                error={errors.inviteEmails}
                                placeholder={UI_TEXT.INVITE_EMAILS_PLACEHOLDER}
                                rows={3}
                            />
                            {visibility === EventVisibility.PRIVATE_INVITE && (
                                <p className="text-xs text-textSecondary mt-1">
                                    {UI_TEXT.PRIVATE_EVENT_NOTE}
                                </p>
                            )}
                         </div>
                    )}
                </div>

                </div>

                {isCommunityOnly && !watchCommunityId && (
                     <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start gap-2">
                        <span>⚠️</span>
                        <span>{UI_TEXT.COMMUNITY_WARNING}</span>
                     </div>
                )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label={UI_TEXT.START_DATE_LABEL}
                    name="startDateTime"
                    type="datetime-local"
                    register={register}
                    error={errors.startDateTime}
                />

                <Input
                    label={UI_TEXT.END_DATE_LABEL}
                    name="endDateTime"
                    type="datetime-local"
                    register={register}
                    error={errors.endDateTime}
                />
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-semibold text-lg">{UI_TEXT.LOCATION_DETAILS_TITLE}</h3>
                
                <Input
                    label={UI_TEXT.VENUE_ADDRESS_LABEL}
                    name="location.address"
                    type="text"
                    register={register}
                    error={errors.location?.address}
                    placeholder={UI_TEXT.VENUE_ADDRESS_PLACEHOLDER}
                    onBlur={handleAddressBlur}
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-textSecondary">{UI_TEXT.PICK_LOCATION_LABEL}</label>
                    <LocationPicker 
                        onChange={handleLocationSelect}
                        forcePosition={mapPosition}
                        initialLocation={mapPosition || undefined}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="text-[10px] text-textSecondary uppercase tracking-wider">
                            Lat: <span className="font-mono">{latitude || '51.505'}</span>
                        </div>
                        <div className="text-[10px] text-textSecondary uppercase tracking-wider">
                            Lng: <span className="font-mono">{longitude || '-0.09'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-border space-y-4">
                <h3 className="font-semibold text-lg">{UI_TEXT.ADDITIONAL_SETTINGS_TITLE}</h3>
                
                <Input
                    label={UI_TEXT.CAPACITY_LABEL}
                    name="capacity"
                    type="number"
                    register={register}
                    error={errors.capacity}
                    min={1}
                />

                <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                     <input 
                        type="checkbox" 
                        id="isRecurring"
                        {...register('isRecurring')}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                     />
                     <label htmlFor="isRecurring" className="text-sm font-medium text-text">{UI_TEXT.RECURRING_EVENT_LABEL}</label>
                </div>

                {isRecurring && (
                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label={UI_TEXT.FREQUENCY_LABEL}
                                name="recurringRule.frequency"
                                register={register}
                                error={getError('recurringRule.frequency')}
                                options={[
                                    { value: 'DAILY', label: UI_TEXT.FREQUENCY_DAILY },
                                    { value: 'WEEKLY', label: UI_TEXT.FREQUENCY_WEEKLY },
                                    { value: 'MONTHLY', label: UI_TEXT.FREQUENCY_MONTHLY },
                                ]}
                            />
                             <Input
                                label={UI_TEXT.INTERVAL_LABEL}
                                name="recurringRule.interval"
                                type="number"
                                register={register}
                                error={getError('recurringRule.interval')}
                                min={1}
                            />
                        </div>
                         <Input
                            label={UI_TEXT.END_DATE_RECURRENCE_LABEL}
                            name="recurringRule.endDate"
                            type="date"
                            register={register}
                            error={getError('recurringRule.endDate')}
                        />
                    </div>
                )}
            </div>

            <Button type="submit" className="w-full py-4 text-lg" isLoading={isSubmitting}>
                {isEditing ? BUTTON_TEXT.SAVE_CHANGES : BUTTON_TEXT.CREATE_EVENT}
            </Button>
        </form>
    );
};

export default EventForm;
