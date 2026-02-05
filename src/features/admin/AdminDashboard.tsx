import { useEffect, useState } from 'react';
import { userApi } from '../../services/api/user.api';
import type { IUser } from '../../types/auth.types';
import Button from '../../components/Button';
import { toast } from 'react-hot-toast';
import { Check, X, Loader2 } from 'lucide-react';

export const AdminDashboard = () => {
    const [requests, setRequests] = useState<IUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const data = await userApi.getPendingRequests();
             // API ensures data structure, assuming data.data is the array if wrapped, or direct array
             // The userApi.getPendingRequests returns response.data which is ApiResponse<IUser[]>
             // So we expect data.data
            setRequests(data as unknown as IUser[]); 
        } catch (error) {
            toast.error('Failed to load requests');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (userId: string) => {
        try {
            await userApi.approveUpgrade(userId);
            toast.success('User upgraded successfully');
            setRequests(prev => prev.filter(u => u._id !== userId && u.id !== userId));
        } catch (error) {
            toast.error('Failed to approve user');
        }
    };

    const handleReject = async (userId: string) => {
        try {
            await userApi.rejectUpgrade(userId);
            toast.success('Request rejected');
            setRequests(prev => prev.filter(u => u._id !== userId && u.id !== userId));
        } catch (error) {
            toast.error('Failed to reject request');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-text mb-8">Admin Dashboard</h1>
            
            <div className="bg-surface rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">Pending Upgrade Requests</h2>
                </div>
                
                {isLoading ? (
                    <div className="p-8 flex justify-center">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="p-8 text-center text-textSecondary">
                        No pending requests found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="p-4 font-medium text-textSecondary">User</th>
                                    <th className="p-4 font-medium text-textSecondary">Email</th>
                                    <th className="p-4 font-medium text-textSecondary">Registered</th>
                                    <th className="p-4 font-medium text-textSecondary text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {requests.map(req => {
                                    const userId = (req.id || req._id || '') as string;
                                    return (
                                        <tr key={userId} className="hover:bg-gray-50/30">
                                            <td className="p-4 font-medium">{req.name}</td>
                                            <td className="p-4 text-textSecondary">{req.email}</td>
                                            <td className="p-4 text-textSecondary">
                                                {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleReject(userId)}
                                                >
                                                    <X className="w-4 h-4 mr-1" /> Reject
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => handleApprove(userId)}
                                                >
                                                    <Check className="w-4 h-4 mr-1" /> Approve
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
