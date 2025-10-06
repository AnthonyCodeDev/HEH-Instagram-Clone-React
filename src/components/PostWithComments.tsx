import { useState, useEffect } from "react";
import { Heart, Bookmark, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Types
export type Comment = {
    author: string;
    avatar: string;
    text: string;
};

export type PostUser = {
    name: string;
    username: string;
    avatar: string;
};

export type PostData = {
    id: string;
    user: PostUser;
    content?: string;
    contentParagraphs?: string[];
    image?: string;
    comments: Comment[];
};

interface PostState {
    liked: boolean;
    saved: boolean;
    likes: number;
}

interface PostWithCommentsProps {
    post: PostData;
    postState: PostState;
    postIndex: number;
    onLike: (index: number) => void;
    onSave: (index: number) => void;
    onAddComment: (postIndex: number, comment: Comment) => void;
}

const PostWithComments = ({
    post,
    postState,
    postIndex,
    onLike,
    onSave,
    onAddComment
}: PostWithCommentsProps) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [visible, setVisible] = useState(3);
    const [newComment, setNewComment] = useState("");

    // Afficher les commentaires (les plus récents en premier)
    const shown = post.comments.slice(0, visible);
    const hasMore = post.comments.length > visible;

    const handleAddComment = () => {
        if (newComment.trim() === "") return;

        // Ajouter le nouveau commentaire
        const commentToAdd = {
            author: "Bahson Nom",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
            text: newComment.trim()
        };

        // Appeler la fonction de callback pour ajouter le commentaire
        onAddComment(postIndex, commentToAdd);

        // Réinitialiser le champ de commentaire
        setNewComment("");
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 last:mb-0">
            {/* Post Header (whole block clickable) */}
            <Link to={`/u/${post.user.username}`} className="flex items-start gap-3 p-6 pb-4">
                <div className="shrink-0">
                    <Avatar className="w-12 h-12">
                        <AvatarImage
                            src={post.user.avatar}
                            alt={post.user.name}
                        />
                        <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{post.user.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">@{post.user.username}</span>
                </div>
            </Link>

            {/* Post Content */}
            <div className="px-6 pb-4">
                <div className="space-y-6">
                    <div className="space-y-2">
                        {post.content && <p className="text-gray-900 leading-relaxed">{post.content}</p>}
                    </div>

                    {post.image ? (
                        <Link to={`/p/${post.id}`}>
                            <div
                                className="rounded-xl overflow-hidden cursor-pointer mt-5"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPreviewImage(post.image as string);
                                }}
                            >
                                <img
                                    src={post.image as string}
                                    alt="Post content"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </Link>
                    ) : post.contentParagraphs ? (
                        <div className="space-y-3">
                            {post.contentParagraphs.map((p: string, idx: number) => (
                                <p key={idx} className="text-gray-900 leading-relaxed">{p}</p>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Post Actions */}
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        className={`flex items-center gap-2 transition-colors ${postState.liked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => onLike(postIndex)}
                    >
                        <Heart className={`w-5 h-5 ${postState.liked ? 'fill-current' : ''}`} />
                        <span className="text-sm">{postState.likes} likes</span>
                    </button>
                </div>

                <button
                    className={`transition-colors ${postState.saved ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    onClick={() => onSave(postIndex)}
                    aria-label="Enregistrer pour plus tard"
                >
                    <Bookmark className={`w-5 h-5 ${postState.saved ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Comments */}
            <div className="px-6 pb-6 pt-2">
                {/* Nouveau champ de commentaire */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="shrink-0">
                        <Avatar className="w-8 h-8">
                            <AvatarImage
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
                                alt="Vous"
                            />
                            <AvatarFallback>BN</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-1 flex">
                        <input
                            type="text"
                            placeholder="Ajouter un commentaire..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 bg-gray-100 rounded-l-xl px-3 py-2 text-sm text-gray-800 focus:outline-none"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddComment();
                                }
                            }}
                        />
                        <button
                            onClick={handleAddComment}
                            className="bg-stragram-primary text-white rounded-r-xl px-3 py-2 text-sm hover:bg-stragram-primary/90 flex items-center justify-center"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="0,0 0,24 24,12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Liste des commentaires existants */}
                <div className="space-y-3">
                    {shown.map((c, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <div className="shrink-0">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={c.avatar} alt={c.author} />
                                    <AvatarFallback>{c.author[0]}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="bg-gray-100 rounded-xl px-3 py-2 text-sm text-gray-800">
                                <span className="font-semibold mr-1">{c.author}</span>
                                {c.text}
                            </div>
                        </div>
                    ))}
                    {hasMore && (
                        <button
                            className="text-sm text-stragram-primary hover:underline"
                            onClick={() => setVisible((v) => v + 5)}
                        >
                            Voir plus
                        </button>
                    )}
                </div>
            </div>

            {/* Image Preview Dialog */}
            <Dialog open={!!previewImage} onOpenChange={(o) => !o && setPreviewImage(null)}>
                <DialogContent variant="bare">
                    {previewImage && (
                        <img src={previewImage} alt="Post content large" className="max-h-[85vh] w-auto object-contain" />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PostWithComments;
