import { useState, useEffect } from 'react';
import { X, UserMinus, Mail, Search } from 'lucide-react';
import { communityApi } from '../services/api/community.api';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import Input from './Input';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';

interface ICommunityMember {
    _id: string;
    name: string;
    email: string;
}

interface CommunityMembersModalProps {
    communityId: string;
    onClose: () => void;
    isAdmin: boolean;
}

const inviteSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
});

const CommunityMembersModal = ({ communityId, onClose, isAdmin }: CommunityMembersModalProps) => {
    const { user: currentUser } = useAuth();
    const [members, setMembers] = useState<ICommunityMember[]>([]);
    const [originalMembers, setOriginalMembers] = useState<ICommunityMember[]>([]);
    const [activeTab, setActiveTab] = useState<'members' | 'invite'>('members');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(inviteSchema)
    });

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await communityApi.getMembers(communityId);
            
                const all = [...data.admins, ...data.members];
                const unique = Array.from(new Map(all.map((item: ICommunityMember) => [item._id, item])).values());
                setMembers(unique);
                setOriginalMembers(unique);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load members');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMembers();
    }, [communityId]);
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (!term) {
            setMembers(originalMembers);
            return;
        }
        setMembers(originalMembers.filter(m => m.name.toLowerCase().includes(term.toLowerCase()) || m.email.toLowerCase().includes(term.toLowerCase())));
    };

    const handleRemove = async (memberId: string) => {
        if (!confirm('Are you sure you want to remove this member?')) return;
        try {
            await communityApi.removeMember(communityId, memberId);
            setMembers(prev => prev.filter(m => m._id !== memberId));
            setOriginalMembers(prev => prev.filter(m => m._id !== memberId));
            toast.success('Member removed');
        } catch (error) {
            toast.error('Failed to remove member');
        }
    };

    // ... (existing imports moved to top)

    const onInvite = async (data: { email: string }) => {
        try {
            await communityApi.invite(communityId, data.email);
            toast.success(`Invitation sent to ${data.email}`);
            reset();
        } catch (error: unknown) {
             const message = error instanceof AxiosError 
                ? error.response?.data?.message 
                : 'Failed to send invite';
             toast.error(message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
                 <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                     <h3 className="font-bold text-lg">Community People</h3>
                     <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                 </div>

                 <div className="flex border-b border-gray-100">
                     <button 
                        onClick={() => setActiveTab('members')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'members' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                     >
                         Members ({members.length})
                     </button>
                     {isAdmin && (
                        <button 
                            onClick={() => setActiveTab('invite')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'invite' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Invite People
                        </button>
                     )}
                 </div>

                 <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                     {activeTab === 'members' && (
                         <div className="space-y-4">
                             <div className="relative">
                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                 <input 
                                    type="text" 
                                    placeholder="Search members..." 
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                 />
                             </div>

                             {isLoading ? (
                                 <div className="text-center py-8">Loading...</div>
                             ) : (
                                 <div className="space-y-3">
                                     {members.map(member => (
                                         <div key={member._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                             <div className="flex items-center gap-3">
                                                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                     {member.name.charAt(0)}
                                                 </div>
                                                 <div>
                                                     <p className="font-medium text-sm text-gray-900">{member.name}</p>
                                                     <p className="text-xs text-gray-500">{member.email}</p>
                                                 </div>
                                             </div>
                                             {isAdmin && member._id !== currentUser?.id && (
                                                 <button 
                                                    onClick={() => handleRemove(member._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50"
                                                    title="Remove Member"
                                                 >
                                                     <UserMinus className="w-4 h-4" />
                                                 </button>
                                             )}
                                         </div>
                                     ))}
                                 </div>
                             )}
                         </div>
                     )}

                     {activeTab === 'invite' && isAdmin && (
                         <div className="space-y-6 pt-2">
                             <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                                 <p>Invite people to your community via email. They will receive an email invitation and an in-app notification if they are already registered.</p>
                             </div>

                             <form onSubmit={handleSubmit(onInvite)} className="space-y-4">
                                 <Input 
                                    label="Email Address" 
                                    name="email" 
                                    type="email" 
                                    placeholder="friend@example.com"
                                    register={register}
                                    error={errors.email} 
                                 />
                                 <Button type="submit" className="w-full">
                                     <Mail className="w-4 h-4 mr-2" />
                                     Send Invitation
                                 </Button>
                             </form>
                         </div>
                     )}
                 </div>
             </div>
        </div>
    );
};

export default CommunityMembersModal;
