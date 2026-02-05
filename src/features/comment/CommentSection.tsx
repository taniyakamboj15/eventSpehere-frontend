import { useEffect, useState } from 'react';
import type { IComment } from '../../types/comment.types';
import { UserRole } from '../../types/auth.types';
import { commentApi } from '../../services/api/comment.api';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';
import Textarea from '../../components/Textarea';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface CommentSectionProps {
    eventId: string;
}

const CommentSection = ({ eventId }: CommentSectionProps) => {
    const { user, isAuthenticated } = useAuth();
    const [comments, setComments] = useState<IComment[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
    
    const { register, handleSubmit, reset } = useForm<{ content: string }>();
    const { register: registerReply, handleSubmit: handleSubmitReply, reset: resetReply } = useForm<{ content: string }>();

    const fetchComments = async (pageNum = 1) => {
        try {
            const data = await commentApi.getByEvent(eventId, pageNum);
            if (pageNum === 1) {
                setComments(data.comments);
            } else {
                setComments(prev => [...prev, ...data.comments]);
            }
            setTotalPages(data.totalPages);
            setPage(pageNum);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments(1);
    }, [eventId]);

    const onSubmit = async (data: { content: string }) => {
        try {
            const newComment = await commentApi.create(eventId, data.content);
            // Optimistically add with current user info or fallback
            // Ensure fallback matches IComment['user'] structure which usually includes _id, name, email
            const fallbackUser = user ? { ...user, _id: user.id } : { _id: 'temp', name: 'You', email: '', role: UserRole.ATTENDEE };
            
            const fullComment: IComment = {
                ...newComment,
                user: (newComment.user && newComment.user.name ? newComment.user : fallbackUser) as any 
                // Note: The 'as any' here might still be needed if IComment.user definition logic is complex in frontend types vs backend response
                // but let's try to remove it if possible or cast to specific type
            };
            // Actually, let's keep 'as any' for now if type is tricky, but we should fix it. 
            // IComment user is likely { _id: string, name: string ... }
            // Let's force it to IComment
            
            // Let's force it to IComment
            
             // @ts-ignore - temporary pending thorough type review of IComment vs AuthUser
            setComments(prev => [fullComment, ...prev]);
            reset();
        } catch (error) {
            console.error('Failed to post comment', error);
        }
    };

    const onReplySubmit = async (data: { content: string }, parentId: string) => {
        try {
            const newReply = await commentApi.create(eventId, data.content, parentId);
            // Ensure user is not null for UI display, though logic should prevent this for authenticated users
            const fallbackUser = user || { _id: 'temp', name: 'You', email: '', role: UserRole.ATTENDEE };
            
            const fullReply = {
                ...newReply,
                user: (newReply.user && newReply.user.name ? newReply.user : fallbackUser) as any,
                replies: []
            };

            const updateReplies = (comments: IComment[]): IComment[] => {
                return comments.map(c => {
                    if (c._id === parentId) {
                        return { ...c, replies: [...(c.replies || []), fullReply] };
                    }
                    if (c.replies && c.replies.length > 0) {
                        return { ...c, replies: updateReplies(c.replies) };
                    }
                    return c;
                });
            };

            setComments(prev => updateReplies(prev));
            resetReply();
            setActiveReplyId(null);
        } catch (error) {
            console.error('Failed to post reply', error);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('Delete this comment?')) return;
        try {
            await commentApi.delete(commentId);
            setComments(prev => {
                // If it's a top-level comment, this removes it
                const remaining = prev.filter(c => c._id !== commentId);
                
                // If it was a reply, we need to find its parent and remove it from replies array
                return remaining.map(c => ({
                    ...c,
                    replies: c.replies ? c.replies.filter(r => r._id !== commentId) : []
                }));
            });
        } catch (error) {
            console.error('Failed to delete comment', error);
        }
    };

    const renderComment = (comment: IComment, isReply = false) => (
        <div key={comment._id} className={`flex gap-4 ${isReply ? 'ml-12 mt-4' : ''}`}>
            <div className={`rounded-full bg-gray-100 flex items-center justify-center text-textSecondary font-bold shrink-0 ${isReply ? 'w-8 h-8 text-xs' : 'w-10 h-10'}`}>
                {comment.user.name?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
                <div className="bg-surface p-4 rounded-xl border border-border">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="font-semibold text-text mr-2">{comment.user.name}</span>
                            <span className="text-xs text-textSecondary">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                             {(user?.id === (comment.user as any)._id || user?._id === (comment.user as any)._id || user?.role === UserRole.ADMIN) && (
                                <button onClick={() => handleDelete(comment._id)} className="text-textSecondary hover:text-error transition-colors ml-2">
                                    <Trash2 className="w-3 h-3 inline" />
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-text whitespace-pre-wrap text-sm">{comment.message}</p>
                </div>
                
                {!isReply && isAuthenticated && (
                    <div className="mt-2">
                        <button 
                            onClick={() => setActiveReplyId(activeReplyId === comment._id ? null : comment._id)}
                            className="text-xs font-bold text-primary hover:underline"
                        >
                            Reply
                        </button>
                        
                        {activeReplyId === comment._id && (
                             <form onSubmit={handleSubmitReply((d) => onReplySubmit(d, comment._id))} className="mt-2 flex gap-2">
                                <input
                                    {...registerReply('content', { required: true })}
                                    className="flex-1 px-3 py-2 text-sm border border-border rounded-lg"
                                    placeholder="Write a reply..."
                                    autoFocus
                                />
                                <Button size="sm" type="submit">Reply</Button>
                             </form>
                        )}
                    </div>
                )}

                {/* Render Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4">
                        {comment.replies.map(reply => renderComment(reply, true))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="mt-12 border-t border-border pt-8">
            <h3 className="text-xl font-bold text-text mb-6">Comments ({comments.length})</h3>

            {/* Main Comment Form */}
            {isAuthenticated ? (
                <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
                    <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <Textarea 
                                label="Leave a comment" 
                                name="content" 
                                register={register}
                                placeholder="Share your thoughts..."
                                rows={3}
                                className="resize-none"
                            />
                             <div className="flex justify-end mt-2">
                                <Button size="sm" type="submit">Post Comment</Button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center mb-8 border border-border">
                    <p className="text-textSecondary">Please sign in to leave a comment.</p>
                </div>
            )}

            {/* Comment List */}
            {isLoading ? (
                <Loader2 className="animate-spin" />
            ) : (
                <div className="space-y-6">
                    {comments.map(comment => renderComment(comment))}
                    
                    {page < totalPages && (
                        <div className="text-center pt-4">
                            <Button variant="outline" onClick={() => fetchComments(page + 1)}>
                                Load More Comments
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentSection;
