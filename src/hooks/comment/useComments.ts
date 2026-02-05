import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { commentApi } from '../../services/api/comment.api';
import { useAuth } from '../../hooks/useAuth';
import type { IComment } from '../../types/comment.types';
import { UserRole } from '../../types/auth.types';

interface UseCommentsProps {
    eventId: string;
}

export const useComments = ({ eventId }: UseCommentsProps) => {
    const { user, isAuthenticated } = useAuth();
    const [comments, setComments] = useState<IComment[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
    
    // Forms
    const form = useForm<{ content: string }>();
    const replyForm = useForm<{ content: string }>();

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
            const fallbackUser = user ? { ...user, _id: user.id } : { _id: 'temp', name: 'You', email: '', role: UserRole.ATTENDEE };
            
            const fullComment: IComment = {
                ...newComment,
                user: (newComment.user && newComment.user.name ? newComment.user : fallbackUser) as { _id: string; name: string; email: string; avatar?: string; role: UserRole }
            };
            
            setComments(prev => [fullComment, ...prev]);
            form.reset();
        } catch (error) {
            console.error('Failed to post comment', error);
        }
    };

    const onReplySubmit = async (data: { content: string }, parentId: string) => {
        try {
            const newReply = await commentApi.create(eventId, data.content, parentId);
            const fallbackUser = user || { _id: 'temp', name: 'You', email: '', role: UserRole.ATTENDEE };
            
            const fullReply = {
                ...newReply,
                user: (newReply.user && newReply.user.name ? newReply.user : fallbackUser) as { _id: string; name: string; email: string; avatar?: string; role: UserRole },
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
            replyForm.reset();
            setActiveReplyId(null);
        } catch (error) {
            console.error('Failed to post reply', error);
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            await commentApi.delete(commentId);
            setComments(prev => {
                const remaining = prev.filter(c => c._id !== commentId);
                const filterReplies = (comments: IComment[]): IComment[] => {
                     return comments.map(c => ({
                         ...c,
                         replies: c.replies ? filterReplies(c.replies.filter(r => r._id !== commentId)) : []
                     }));
                };
                return filterReplies(remaining);
            });
        } catch (error) {
            console.error('Failed to delete comment', error);
        }
    };

    return {
        comments,
        page,
        totalPages,
        isLoading,
        activeReplyId,
        setActiveReplyId,
        fetchComments,
        onSubmit,
        onReplySubmit,
        handleDelete,
        form,
        replyForm,
        user,
        isAuthenticated
    };
};
