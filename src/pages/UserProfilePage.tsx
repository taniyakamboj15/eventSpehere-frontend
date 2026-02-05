import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import { User, Mail, Shield, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

const UserProfilePage = () => {
    const { user } = useAuth();

    const [isEditing, setIsEditing] = useState(false);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: user?.name,
            email: user?.email,
        }
    });

    const onSubmit = async () => {
        
        toast.success('Profile updated successfully!');
        setIsEditing(false);
    };

    if (!user) return null;

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
             <h1 className="text-3xl font-bold text-text mb-8">My Profile</h1>
             
             <div className="grid md:grid-cols-3 gap-8">
                {/* ID Card */}
                <div className="md:col-span-1">
                    <div className="bg-surface rounded-3xl p-8 border border-border shadow-lg relative overflow-hidden text-center">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                        
                        <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-primary/20">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        
                        <h2 className="text-xl font-bold text-text mb-1">{user.name}</h2>
                        <span className="inline-block px-3 py-1 bg-gray-100 text-textSecondary text-xs font-bold rounded-full uppercase tracking-wider mb-6">
                            {user.role}
                        </span>

                        <div className="pt-6 border-t border-border flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-sm text-textSecondary">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-textSecondary">
                                <Shield className="w-4 h-4" />
                                <span>ID: {user._id?.slice(-6) || '...'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2 space-y-8">
                     <div className="bg-surface rounded-3xl p-8 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-text">Account Details</h3>
                             <Button 
                                variant={isEditing ? 'secondary' : 'outline'} 
                                size="sm" 
                                onClick={() => setIsEditing(!isEditing)}
                             >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                             </Button>
                        </div>
                        
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <Input
                                label="Full Name"
                                name="name"
                                register={register}
                                disabled={!isEditing}
                                icon={<User className="w-4 h-4 text-textSecondary" />}
                            />
                            <Input
                                label="Email Address"
                                name="email"
                                register={register}
                                disabled={!isEditing} // Email usually immutable or requires verification
                                icon={<Mail className="w-4 h-4 text-textSecondary" />}
                                // hint="Email cannot be changed."
                            />

                            {isEditing && (
                                <div className="pt-4 flex justify-end">
                                    <Button type="submit">Save Changes</Button>
                                </div>
                            )}
                        </form>
                     </div>

                     {/* Upgrade Status */}
                     {user.role === 'ATTENDEE' && (
                         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
                             <div className="flex items-start gap-4">
                                 <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
                                     <Sparkles className="w-6 h-6" />
                                 </div>
                                 <div className="flex-1">
                                     <h3 className="text-lg font-bold text-blue-900 mb-2">Organizer Status</h3>
                                     {user.upgradeStatus === 'PENDING' ? (
                                         <p className="text-blue-700">
                                             Your application is currently <strong>Under Review</strong>. You will be notified once an admin processes your request.
                                         </p>
                                     ) : user.upgradeStatus === 'REJECTED' ? (
                                         <p className="text-red-700">
                                             Your application was not approved. Please contact support for more information.
                                         </p>
                                     ) : (
                                        <div>
                                             <p className="text-blue-700 mb-4">
                                                 Want to host your own events? Upgrade your account to become an community organizer.
                                             </p>
                                             {/* We could add the upgrade button here too, but it's on dashboard */}
                                        </div>
                                     )}
                                 </div>
                             </div>
                         </div>
                     )}
                </div>
             </div>
        </div>
    );
};

export default UserProfilePage;
