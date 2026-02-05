import Button from '../../components/Button';
import { Check, X, Loader2 } from 'lucide-react';
import { UI_TEXT } from '../../constants/text.constants';
import { useAdminDashboard } from '../../hooks/admin/useAdminDashboard';

export const AdminDashboard = () => {
    const { requests, isLoading, handleApprove, handleReject } = useAdminDashboard();

    return (
        <div>
            <h1 className="text-3xl font-bold text-text mb-8">{UI_TEXT.ADMIN_DASHBOARD_TITLE}</h1>
            
            <div className="bg-surface rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">{UI_TEXT.ADMIN_PENDING_TITLE}</h2>
                </div>
                
                {isLoading ? (
                    <div className="p-8 flex justify-center">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="p-8 text-center text-textSecondary">
                        {UI_TEXT.ADMIN_NO_REQUESTS}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="p-4 font-medium text-textSecondary">{UI_TEXT.ADMIN_TABLE_USER}</th>
                                    <th className="p-4 font-medium text-textSecondary">{UI_TEXT.ADMIN_TABLE_EMAIL}</th>
                                    <th className="p-4 font-medium text-textSecondary">{UI_TEXT.ADMIN_TABLE_REGISTERED}</th>
                                    <th className="p-4 font-medium text-textSecondary text-right">{UI_TEXT.ADMIN_TABLE_ACTIONS}</th>
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
                                                    <X className="w-4 h-4 mr-1" /> {UI_TEXT.ADMIN_REJECT}
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => handleApprove(userId)}
                                                >
                                                    <Check className="w-4 h-4 mr-1" /> {UI_TEXT.ADMIN_APPROVE}
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
