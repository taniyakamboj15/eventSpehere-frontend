import Input from '../components/Input';
import Button from '../components/Button';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import LocationPicker from '../components/LocationPicker';
import { useCreateCommunity } from '../hooks/useCreateCommunity';

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
                    <div className="h-64 rounded-xl overflow-hidden border border-border">
                        <LocationPicker 
                            onChange={(pos) => {
                                setValue('latitude', pos.lat);
                                setValue('longitude', pos.lng);
                            }}
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
