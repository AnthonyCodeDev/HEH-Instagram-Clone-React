import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send } from "lucide-react";
import { userService } from "@/services/userService";

interface CommentInputProps {
    onSubmit: (text: string) => Promise<void>;
    isSubmitting: boolean;
}

export function CommentInput({ onSubmit, isSubmitting }: CommentInputProps) {
    const [newComment, setNewComment] = useState("");
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        // Récupérer les informations de l'utilisateur connecté
        const fetchUserInfo = async () => {
            try {
                const userData = await userService.getCurrentUser();
                if (userData) {
                    setUserAvatar(userData.avatarUrl);
                    setUserName(userData.username);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des informations de l'utilisateur:", error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleSubmit = async () => {
        if (newComment.trim() === "" || isSubmitting) return;
        await onSubmit(newComment);
        setNewComment("");
    };

    return (
        <div className="flex items-start gap-3 mb-4">
            <div className="shrink-0">
                <Avatar className="w-8 h-8">
                    <AvatarImage
                        src={userAvatar || undefined}
                        alt={userName || 'Vous'}
                    />
                    <AvatarFallback>
                        {userName ? userName[0].toLowerCase() : '?'}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-1 flex">
                <input
                    type="text"
                    placeholder="Ajouter un commentaire..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-gray-100 rounded-l-xl px-3 py-2 text-sm text-gray-800 focus:outline-none"
                    disabled={isSubmitting}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isSubmitting) {
                            handleSubmit();
                        }
                    }}
                />
                <button
                    onClick={handleSubmit}
                    className="bg-stragram-primary text-white rounded-r-xl px-3 py-2 text-sm hover:bg-stragram-primary/90 flex items-center justify-center"
                    disabled={isSubmitting || !newComment.trim()}
                >
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                </button>
            </div>
        </div>
    );
}