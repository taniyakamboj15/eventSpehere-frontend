import type { IComment } from '../../types/comment.types';
import { UserRole } from '../../types/auth.types';
import Button from '../../components/Button';
import Textarea from '../../components/Textarea';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Trash2 } from 'lucide-react';
import { useComments } from '../../hooks/comment/useComments';
import { UI_TEXT } from '../../constants/text.constants';

interface CommentSectionProps {
    eventId: string;
}

const CommentSection = ({ eventId }: CommentSectionProps) => {
    const {
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
        form: { register, handleSubmit },
        replyForm: { register: registerReply, handleSubmit: handleSubmitReply },
        user,
        isAuthenticated
    } = useComments({ eventId });

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
                             {(user?.id === comment.user._id || user?._id === comment.user._id || user?.role === UserRole.ADMIN) && (
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
                            {UI_TEXT.COMMENT_REPLY_BUTTON}
                        </button>
                        
                        {activeReplyId === comment._id && (
                             <form onSubmit={handleSubmitReply((d) => onReplySubmit(d, comment._id))} className="mt-2 flex gap-2">
                                <input
                                    {...registerReply('content', { required: true })}
                                    className="flex-1 px-3 py-2 text-sm border border-border rounded-lg"
                                    placeholder={UI_TEXT.COMMENT_REPLY_PLACEHOLDER}
                                    autoFocus
                                />
                                <Button size="sm" type="submit">{UI_TEXT.COMMENT_REPLY_BUTTON}</Button>
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
            <h3 className="text-xl font-bold text-text mb-6">{UI_TEXT.COMMENTS_HEADER} ({comments.length})</h3>

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
                                placeholder={UI_TEXT.COMMENT_PLACEHOLDER}
                                rows={3}
                                className="resize-none"
                            />
                             <div className="flex justify-end mt-2">
                                <Button size="sm" type="submit">{UI_TEXT.COMMENT_POST_BUTTON}</Button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center mb-8 border border-border">
                    <p className="text-textSecondary">{UI_TEXT.COMMENT_LOGIN_PROMPT}</p>
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
                                {UI_TEXT.COMMENT_LOAD_MORE}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentSection;
