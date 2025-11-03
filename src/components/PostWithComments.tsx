import { useState, useEffect } from "react";
import { Heart, Bookmark, X, Loader2, Send, MoreVertical, Trash2, Link2, Copy, Check } from "lucide-react";
import { CommentInput } from "@/components/CommentInput";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Types
export type Comment = {
    id?: string;
    author: string;
    avatar: string | null;
    text: string;
    createdAt?: string;
    authorId?: string;
    authorUsername?: string;
    authorAvatarUrl?: string | null;
    postId?: string;
};

// Type pour la réponse de l'API des commentaires
interface ApiCommentResponse {
    id: string;
    postId: string;
    authorId: string;
    authorUsername: string;
    authorAvatarUrl: string | null;
    text: string;
    createdAt: string;
    updatedAt: string;
}

export type PostUser = {
    id?: string;
    name: string;
    username: string;
    avatar: string | null;
};

export type PostData = {
    id: string;
    user: PostUser;
    content?: string;
    contentParagraphs?: string[];
    image?: string;
    comments: Comment[];
    commentCount?: number;
    authorId?: string;
    isDeleting?: boolean;
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
    onDeletePost?: (postId: string) => Promise<void>;
    isLiking?: Record<string, boolean>;
    isSaving?: Record<string, boolean>;
    currentUserId?: string;
}

const PostWithComments = ({
    post,
    postState,
    postIndex,
    onLike,
    onSave,
    onAddComment,
    onDeletePost,
    isLiking = {},
    isSaving = {},
    currentUserId = ""
}: PostWithCommentsProps) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [visible, setVisible] = useState(3);
    // removed local newComment state: CommentInput gère sa propre valeur
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [hasMoreComments, setHasMoreComments] = useState(false);
    const [commentsPage, setCommentsPage] = useState(0);
    const [deletingComments, setDeletingComments] = useState<Record<string, boolean>>({});
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeletingPost, setIsDeletingPost] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    // Récupérer l'ID utilisateur depuis le localStorage comme fallback
    const storedUserId = localStorage.getItem('userId');

    // Vérifier si l'utilisateur connecté est l'auteur du post
    const userIdToCheck = currentUserId || storedUserId;
    const isAuthorByUserId = userIdToCheck === post.user.id;
    const isAuthorByAuthorId = userIdToCheck === post.authorId;

    // Utiliser la méthode qui fonctionne le mieux
    const isAuthor = isAuthorByUserId || isAuthorByAuthorId;

    // Fonction pour copier le lien du post
    const copyPostLink = () => {
        // Créer l'URL complète du post
        const postUrl = `${window.location.origin}/p/${post.id}`;

        // Copier l'URL dans le presse-papier
        navigator.clipboard.writeText(postUrl)
            .then(() => {
                setLinkCopied(true);
                toast({
                    title: "Lien copié",
                    description: "Le lien du post a été copié dans le presse-papier"
                });

                // Réinitialiser l'icône après 2 secondes
                setTimeout(() => {
                    setLinkCopied(false);
                }, 2000);
            })
            .catch(error => {
                // Gérer silencieusement l'erreur
                toast({
                    title: "Erreur",
                    description: "Impossible de copier le lien",
                    variant: "destructive"
                });
            });
    };

    // Fonction pour récupérer les commentaires d'un post
    const fetchComments = async (postId: string, page: number = 0, size: number = 10) => {
        try {
            setIsLoadingComments(true);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Non authentifié');
            }

            const response = await fetch(`http://localhost:8081/posts/${postId}/comments?page=${page}&size=${size}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Erreur ${response.status}`);
            }

            const data = await response.json();
            // console.log('Commentaires reçus:', data);

            // Convertir les commentaires de l'API au format attendu par le composant et les trier
            const formattedComments = data.comments.map((comment: ApiCommentResponse) => ({
                id: comment.id,
                author: comment.authorUsername,
                avatar: comment.authorAvatarUrl || undefined,
                text: comment.text,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                authorId: comment.authorId,
                authorUsername: comment.authorUsername,
                authorAvatarUrl: comment.authorAvatarUrl,
                postId: comment.postId
            })).sort((a, b) => {
                const dateA = new Date(a.updatedAt || a.createdAt);
                const dateB = new Date(b.updatedAt || b.createdAt);
                return dateB.getTime() - dateA.getTime();
            });

            return {
                comments: formattedComments,
                hasMore: data.hasMore,
                page: data.page,
                size: data.size
            };
        } catch (error) {
            // Gérer silencieusement l'erreur
            throw error;
        } finally {
            setIsLoadingComments(false);
        }
    };

    // Fonction pour envoyer un commentaire à l'API
    const postComment = async (postId: string, text: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Non authentifié');
            }

            const response = await fetch(`http://localhost:8081/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Erreur ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            // Gérer silencieusement l'erreur
            throw error;
        }
    };

    // Charger les commentaires au montage du composant et lors des rafraîchissements
    useEffect(() => {
        const loadComments = async () => {
            try {
                // Charger les commentaires pour tous les posts (même si commentCount est 0)
                if (post.id) {
                    // console.log(`Chargement des commentaires pour le post ${post.id}`);
                    const result = await fetchComments(post.id);
                    // console.log(`${result.comments.length} commentaires chargés pour le post ${post.id}`);
                    setComments(result.comments);
                    setHasMoreComments(result.hasMore);
                    setCommentsPage(result.page);
                }
            } catch (error) {
                // Gérer silencieusement l'erreur
                toast({
                    title: "Erreur",
                    description: "Impossible de charger les commentaires",
                    variant: "destructive"
                });
            }
        };

        loadComments();
    }, [post.id]);


    // Afficher les commentaires (les plus récents en premier)
    const shown = comments.slice(0, visible);
    const hasMore = comments.length > visible || hasMoreComments;

    // Supprimer un commentaire via l'API
    const deleteComment = async (commentId?: string) => {
        if (!commentId) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Non authentifié');

            // Marquer en cours
            setDeletingComments(prev => ({ ...prev, [commentId]: true }));

            const response = await fetch(`http://localhost:8081/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Erreur ${response.status}`);
            }

            // Retirer localement le commentaire
            setComments(prev => prev.filter(c => c.id !== commentId));

            // Mettre à jour le compteur de commentaires du post si présent
            if (post.commentCount !== undefined && post.commentCount > 0) {
                post.commentCount -= 1;
            }

            toast({
                title: 'Commentaire supprimé',
                description: 'Le commentaire a bien été supprimé.'
            });
        } catch (error) {
            toast({
                title: 'Erreur',
                description: error instanceof Error ? error.message : 'Impossible de supprimer le commentaire',
                variant: 'destructive'
            });
        } finally {
            setDeletingComments(prev => {
                const next = { ...prev };
                delete next[commentId];
                return next;
            });
        }
    };

    // Accept a text parameter to avoid relying on a possibly stale parent state
    const handleAddComment = async (text?: string) => {
        const commentText = (text ?? "").trim();
        if (commentText === "") return;

        setIsSubmittingComment(true);

        try {
            // Envoyer le commentaire à l'API
            const commentData = await postComment(post.id, commentText);

            // Créer un objet commentaire à partir de la réponse de l'API
            const commentToAdd = {
                id: commentData.id,
                author: commentData.authorUsername,
                avatar: commentData.authorAvatarUrl || null,
                text: commentData.text,
                createdAt: commentData.createdAt,
                authorId: commentData.authorId,
                authorUsername: commentData.authorUsername,
                authorAvatarUrl: commentData.authorAvatarUrl,
                postId: commentData.postId
            };

            // Ajouter le commentaire à la liste locale des commentaires
            setComments(prevComments => [commentToAdd, ...prevComments]);

            // Mettre à jour le compteur de commentaires dans le post (si nécessaire)
            if (post.commentCount !== undefined) {
                post.commentCount += 1;
            }

            // Appeler la fonction de callback pour ajouter le commentaire (pour compatibilité)
            onAddComment(postIndex, commentToAdd);

            // Afficher un message de succès (optionnel)
            toast({
                title: "Succès",
                description: "Votre commentaire a été publié"
            });
        } catch (error) {
            // Gérer silencieusement l'erreur
            toast({
                title: "Erreur",
                description: error instanceof Error ? error.message : "Impossible d'ajouter le commentaire",
                variant: "destructive"
            });
        } finally {
            setIsSubmittingComment(false);
        }
    };

    // Fonction pour supprimer un post
    const handleDeletePost = async () => {
        if (!post.id || !onDeletePost) return;

        try {
            // Fermer d'abord la popup pour que l'animation soit visible immédiatement
            setIsDeleteDialogOpen(false);

            // Indiquer que la suppression est en cours
            setIsDeletingPost(true);

            // Déclencher l'animation de suppression via onDeletePost
            await onDeletePost(post.id);

            toast({
                title: "Succès",
                description: "Le post a été supprimé"
            });
        } catch (error) {
            // Gérer silencieusement l'erreur
            toast({
                title: "Erreur",
                description: error instanceof Error ? error.message : "Impossible de supprimer le post",
                variant: "destructive"
            });
        } finally {
            setIsDeletingPost(false);
        }
    };

    return (
        <AnimatePresence mode="popLayout">
            <motion.div
                className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 last:mb-0"
                layout
                initial={{ opacity: 1, scale: 1, height: "auto" }}
                animate={{
                    opacity: post.isDeleting ? 0 : 1,
                    scale: post.isDeleting ? 0.8 : 1,
                    height: post.isDeleting ? 0 : "auto",
                    marginBottom: post.isDeleting ? 0 : undefined,
                }}
                exit={{
                    opacity: 0,
                    scale: 0.8,
                    height: 0,
                    marginBottom: 0,
                    transition: { duration: 0.5, ease: "easeInOut" }
                }}
                transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                }}
            >
                {/* Post Header */}
                <div className="flex items-start justify-between p-6 pb-4">
                    <Link to={`/u/${post.user.username}`} className="flex items-start gap-3 flex-1">
                        <div className="shrink-0">
                            <Avatar className="w-12 h-12">
                                <AvatarImage
                                    src={post.user.avatar || undefined}
                                    alt={post.user.name}
                                />
                                <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('').toLowerCase()}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{post.user.name}</span>
                            </div>
                            <span className="text-sm text-gray-500">@{post.user.username}</span>
                        </div>
                    </Link>

                    {/* Menu trois points (apparaît pour tous les posts) */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                <MoreVertical className="h-5 w-5 text-gray-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* Option "Copier le lien" pour tous les posts */}
                            <DropdownMenuItem
                                className="cursor-pointer flex items-center gap-2"
                                onClick={copyPostLink}
                            >
                                {linkCopied ? (
                                    <>
                                        <Check className="h-4 w-4 text-green-500" />
                                        Lien copié
                                    </>
                                ) : (
                                    <>
                                        <Link2 className="h-4 w-4" />
                                        Copier le lien
                                    </>
                                )}
                            </DropdownMenuItem>

                            {/* Option "Supprimer" uniquement pour les posts de l'utilisateur connecté */}
                            {isAuthor && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600 cursor-pointer flex items-center gap-2"
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Supprimer
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

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
                            className={`flex items-center gap-2 transition-all duration-150 ${postState.liked ? 'bg-[#EC3558] text-white rounded-md px-2 py-1' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-md px-2 py-1'}`}
                            onClick={() => onLike(postIndex)}
                            disabled={isLiking[post.id]}
                        >
                            {isLiking[post.id] ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Heart className={`w-5 h-5 ${postState.liked ? 'fill-current' : ''}`} />
                            )}
                            <span className="text-sm">{postState.likes} likes</span>
                        </button>
                    </div>

                    <button
                        className={`transition-all duration-150 ${postState.saved ? 'bg-[#EC3558] text-white rounded-md p-2' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-md p-2'}`}
                        onClick={() => onSave(postIndex)}
                        aria-label="Enregistrer pour plus tard"
                        disabled={isSaving[post.id]}
                    >
                        {isSaving[post.id] ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Bookmark className={`w-5 h-5 ${postState.saved ? 'fill-current' : ''}`} />
                        )}
                    </button>
                </div>

                {/* Comments */}
                <div className="px-6 pb-6 pt-2">
                    {/* Nouveau champ de commentaire */}
                    <div className="mb-4">
                        <CommentInput
                            onSubmit={async (text) => {
                                await handleAddComment(text);
                            }}
                            isSubmitting={isSubmittingComment}
                        />
                    </div>

                    {/* Liste des commentaires existants */}
                    <div className="space-y-3">
                        {/* État de chargement des commentaires */}
                        {isLoadingComments && (
                            <div className="flex justify-center items-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-stragram-primary" />
                                <span className="ml-2 text-sm text-gray-500">Chargement des commentaires...</span>
                            </div>
                        )}

                        {/* Message si aucun commentaire */}
                        {!isLoadingComments && comments.length === 0 && (
                            <div className="text-center py-4">
                                <p className="text-sm text-gray-500">Aucun commentaire pour le moment</p>
                                <p className="text-xs text-gray-400">Soyez le premier à commenter</p>
                            </div>
                        )}

                        {/* Liste des commentaires */}
                        {shown.map((c, idx) => {
                            const canDelete = !!(c.authorId && userIdToCheck && c.authorId === userIdToCheck);
                            return (
                                <div key={c.id || idx} className="flex items-start gap-3">
                                    <div className="shrink-0">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={c.avatar || undefined} alt={c.author} />
                                            <AvatarFallback>{c.author[0].toLowerCase()}</AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="flex-1 flex items-center justify-between">
                                        <div className="bg-gray-100 rounded-xl px-3 py-2 text-sm text-gray-800 max-w-full">
                                            <span className="font-semibold mr-1">{c.author}</span>
                                            {c.text}
                                        </div>

                                        {canDelete && (
                                            <button
                                                className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-md"
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    if (!c.id) return;
                                                    await deleteComment(c.id);
                                                }}
                                                aria-label="Supprimer le commentaire"
                                            >
                                                {deletingComments[c.id || ''] ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Bouton "Voir plus" */}
                        {hasMore && (
                            <button
                                className="text-sm text-stragram-primary hover:underline"
                                onClick={() => {
                                    if (comments.length > visible) {
                                        // Si on a déjà chargé plus de commentaires que ceux affichés
                                        setVisible((v) => v + 5);
                                    } else if (hasMoreComments) {
                                        // Sinon, charger plus de commentaires depuis l'API
                                        setIsLoadingComments(true);
                                        fetchComments(post.id, commentsPage + 1)
                                            .then(result => {
                                                setComments(prev => {
                                                    const allComments = [...prev, ...result.comments];
                                                    // Trier tous les commentaires par updatedAt
                                                    return allComments.sort((a, b) => {
                                                        const dateA = new Date(a.updatedAt || a.createdAt || 0);
                                                        const dateB = new Date(b.updatedAt || b.createdAt || 0);
                                                        return dateB.getTime() - dateA.getTime();
                                                    });
                                                });
                                                setHasMoreComments(result.hasMore);
                                                setCommentsPage(result.page);
                                                setVisible(v => v + 5);
                                            })
                                            .catch(error => {
                                                // Gérer silencieusement l'erreur
                                                toast({
                                                    title: "Erreur",
                                                    description: "Impossible de charger plus de commentaires",
                                                    variant: "destructive"
                                                });
                                            })
                                            .finally(() => setIsLoadingComments(false));
                                    }
                                }}
                                disabled={isLoadingComments}
                            >
                                {isLoadingComments ? 'Chargement...' : 'Voir plus'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Image Preview Dialog */}
                <Dialog open={!!previewImage} onOpenChange={(open) => { if (!open) setPreviewImage(null); }}>
                    <DialogContent className="p-0 bg-transparent flex items-center justify-center" variant="bare">
                        {previewImage && (
                            <div className="relative w-full max-w-[90vw] max-h-[90vh]">
                                {/* Bouton de fermeture stylé en haut à droite */}
                                <button
                                    onClick={() => setPreviewImage(null)}
                                    aria-label="Fermer"
                                    className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm shadow-md"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {/* Conteneur image centré avec ombre et bords arrondis */}
                                <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-lg shadow-2xl bg-black">
                                    <img
                                        src={previewImage}
                                        alt="Aperçu du post"
                                        className="max-w-full max-h-[90vh] object-contain"
                                    />
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Boîte de dialogue de confirmation de suppression */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer ce post ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Cette action est irréversible. Le post sera définitivement supprimé de nos serveurs.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeletingPost}>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.preventDefault(); // Éviter la fermeture automatique
                                    handleDeletePost();
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white"
                                disabled={isDeletingPost}
                            >
                                {isDeletingPost ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Suppression...
                                    </>
                                ) : (
                                    "Supprimer"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </motion.div>
        </AnimatePresence>
    );
};

export default PostWithComments;
