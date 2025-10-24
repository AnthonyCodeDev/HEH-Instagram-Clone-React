import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import RightBar from "@/components/RightBar";
import { useState, useEffect } from "react";
import PostWithComments from "@/components/PostWithComments";
import { postService } from "@/services/postService";
import type { PostResponse, Comment } from "@/types/post";

const ProfilePost = () => {
    const { postId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [post, setPost] = useState<PostResponse | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [hasMoreComments, setHasMoreComments] = useState(false);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const loadPost = async () => {
            if (!postId) return;

            try {
                setLoading(true);
                setError(null);

                // Charger le post
                const postData = await postService.getPostById(postId);
                setPost(postData);

                // Charger les commentaires
                const commentsData = await postService.getPostComments(postId);
                setComments(commentsData.comments);
                setHasMoreComments(commentsData.hasMore);
                setPage(commentsData.page);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Une erreur est survenue");
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [postId]);


    const [isLiking, setIsLiking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleLike = async () => {
        if (!post || !postId || isLiking) return;

        try {
            setIsLiking(true);

            if (post.likedByCurrentUser) {
                await postService.unlikePost(postId);
            } else {
                await postService.likePost(postId);
            }

            setPost(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    likedByCurrentUser: !prev.likedByCurrentUser,
                    likeCount: prev.likedByCurrentUser ? prev.likeCount - 1 : prev.likeCount + 1
                };
            });
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleSave = async () => {
        if (!post || !postId || isSaving) return;

        try {
            setIsSaving(true);

            if (post.favoritedByCurrentUser) {
                await postService.unfavoritePost(postId);
            } else {
                await postService.favoritePost(postId);
            }

            setPost(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    favoritedByCurrentUser: !prev.favoritedByCurrentUser
                };
            });
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddComment = (_postIndex: number, comment: Comment) => {
        if (!postId) return;

        // Convertir le commentaire au format attendu par l'état
        const newComment = {
            id: comment.id,
            authorId: comment.authorId,
            authorUsername: comment.authorUsername,
            authorAvatarUrl: comment.authorAvatarUrl,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
        };

        // Mettre à jour la liste des commentaires
        setComments(prev => [newComment, ...prev]);

        // Mettre à jour le compteur de commentaires
        setPost(prev => {
            if (!prev) return null;
            return {
                ...prev,
                commentCount: prev.commentCount + 1
            };
        });
    };

    const handleDeletePost = async (id: string) => {
        try {
            await postService.deletePost(id);
            // Rediriger vers le profil de l'utilisateur après la suppression
            const username = localStorage.getItem('username');
            window.location.href = `/u/${username}`;
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    };

    const loadMoreComments = async () => {
        if (!postId || !hasMoreComments || loading) return;

        try {
            setLoading(true);
            const nextPage = page + 1;
            const moreComments = await postService.getPostComments(postId, nextPage);
            setComments(prev => [...prev, ...moreComments.comments]);
            setHasMoreComments(moreComments.hasMore);
            setPage(moreComments.page);
        } catch (error) {
            console.error('Error loading more comments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p>Chargement...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-xl font-semibold mb-2">
                            {error || "Publication introuvable"}
                        </h1>
                        <p className="text-gray-600">Cette publication n'existe pas ou a été supprimée.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex max-w-none h-full overflow-x-hidden">
                <div className="flex-1 p-6 pb-24 sm:pb-6 overflow-y-auto w-full">
                    <div className="max-w-3xl mx-auto">
                        <PostWithComments
                            post={{
                                id: post.id,
                                user: {
                                    id: post.authorId,  // Ajout de l'ID de l'auteur
                                    name: post.authorUsername,
                                    username: post.authorUsername,
                                    avatar: post.authorAvatarUrl
                                },
                                authorId: post.authorId,  // Ajout de l'ID de l'auteur au niveau du post
                                content: post.description,
                                image: post.imageUrl,
                                comments: comments.map(comment => ({
                                    id: comment.id,
                                    author: comment.authorUsername,
                                    avatar: comment.authorAvatarUrl,
                                    text: comment.content,
                                    createdAt: comment.createdAt
                                }))
                            }}
                            postState={{
                                liked: post.likedByCurrentUser,
                                saved: post.favoritedByCurrentUser,
                                likes: post.likeCount
                            }}
                            postIndex={0}
                            onLike={() => handleLike()}
                            onSave={() => handleSave()}
                            onAddComment={(_, comment) => {
                                if (!comment.text) return;
                                handleAddComment(_, {
                                    id: comment.id || "",
                                    authorId: comment.authorId || "",
                                    authorUsername: comment.author,
                                    authorAvatarUrl: comment.avatar,
                                    content: comment.text,
                                    createdAt: comment.createdAt || new Date().toISOString(),
                                    updatedAt: null
                                });
                            }}
                            isLiking={{ [post.id]: isLiking }}
                            isSaving={{ [post.id]: isSaving }}
                            currentUserId={localStorage.getItem("userId")}
                            onDeletePost={handleDeletePost}
                        />
                    </div>
                </div>

                <RightBar />
            </div>
        </div>
    );
};

export default ProfilePost;


