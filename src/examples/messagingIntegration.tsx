/**
 * 💡 Exemples d'intégration de la messagerie
 * 
 * ⚠️ ATTENTION : Ce fichier contient uniquement des exemples de code.
 * Il n'est pas destiné à être importé ou compilé directement.
 * 
 * Copiez les exemples dont vous avez besoin dans vos propres composants.
 * Les imports sont volontairement dupliqués pour que chaque exemple soit indépendant.
 * 
 * Ce fichier contient des exemples de code pour intégrer
 * la messagerie dans d'autres composants de l'application.
 */

// @ts-nocheck - Fichier d'exemples uniquement, pas de vérification TypeScript

import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

// ============================================
// EXEMPLE 1 : Bouton "Message" dans un profil
// ============================================

interface UserProfileMessageButtonProps {
    username: string;
}

export function UserProfileMessageButton({ username }: UserProfileMessageButtonProps) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(`/messages?u=${username}`)}
            className="px-4 py-2 bg-[#EC3558] text-white rounded-lg hover:bg-[#EC3558]/90 transition-colors flex items-center gap-2"
        >
            <MessageCircle className="w-4 h-4" />
            Message
        </button>
    );
}

// ============================================
// EXEMPLE 2 : Lien dans une liste d'utilisateurs
// ============================================

import { Link } from 'react-router-dom';

interface UserListItemProps {
    user: {
        username: string;
        name: string;
        avatar: string;
    };
}

export function UserListItem({ user }: UserListItemProps) {
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                </div>
            </div>
            <Link
                to={`/messages?u=${user.username}`}
                className="text-[#EC3558] hover:underline text-sm"
            >
                Envoyer un message
            </Link>
        </div>
    );
}

// ============================================
// EXEMPLE 3 : Badge de messages non lus
// ============================================

import { useEffect, useState } from 'react';
import { messageService } from '@/services/messageService';

export function UnreadMessagesBadge() {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Charger le nombre de messages non lus
        const loadUnreadCount = async () => {
            try {
                const count = await messageService.getUnreadCount();
                setUnreadCount(count);
            } catch (error) {
                console.error('Error loading unread count:', error);
            }
        };

        loadUnreadCount();

        // Recharger toutes les 30 secondes
        const interval = setInterval(loadUnreadCount, 30000);

        return () => clearInterval(interval);
    }, []);

    if (unreadCount === 0) return null;

    return (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#EC3558] text-white rounded-full flex items-center justify-center text-xs font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
        </div>
    );
}

// ============================================
// EXEMPLE 4 : Icône Messages dans la navigation
// ============================================

import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MessagesNavIcon() {
    return (
        <Link to="/messages" className="relative">
            <MessageCircle className="w-6 h-6 text-gray-700 hover:text-[#EC3558] transition-colors" />
            <UnreadMessagesBadge />
        </Link>
    );
}

// ============================================
// EXEMPLE 5 : Ouvrir une conversation depuis un post
// ============================================

interface PostHeaderProps {
    post: {
        author: {
            username: string;
            name: string;
            avatar: string;
        };
    };
}

export function PostHeader({ post }: PostHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
                <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <div className="font-medium">{post.author.name}</div>
                    <div className="text-sm text-gray-500">@{post.author.username}</div>
                </div>
            </div>
            <button
                onClick={() => navigate(`/messages?u=${post.author.username}`)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Envoyer un message"
            >
                <MessageCircle className="w-5 h-5 text-gray-600" />
            </button>
        </div>
    );
}

// ============================================
// EXEMPLE 6 : Hook personnalisé pour vérifier si une conversation existe
// ============================================

import { useEffect, useState } from 'react';
import { messageService } from '@/services/messageService';

export function useHasConversation(userId: string) {
    const [hasConversation, setHasConversation] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkConversation = async () => {
            try {
                const conversations = await messageService.getConversations();
                const exists = conversations.some(conv => conv.otherUserId === userId);
                setHasConversation(exists);
            } catch (error) {
                console.error('Error checking conversation:', error);
            } finally {
                setLoading(false);
            }
        };

        checkConversation();
    }, [userId]);

    return { hasConversation, loading };
}

// Utilisation du hook
export function UserProfileWithConversationCheck({ userId, username }: { userId: string; username: string; }) {
    const { hasConversation, loading } = useHasConversation(userId);
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(`/messages?u=${username}`)}
            disabled={loading}
            className="px-4 py-2 bg-[#EC3558] text-white rounded-lg hover:bg-[#EC3558]/90 transition-colors"
        >
            {loading ? 'Chargement...' : hasConversation ? 'Voir la conversation' : 'Nouveau message'}
        </button>
    );
}

// ============================================
// EXEMPLE 7 : Modal de confirmation avant d'envoyer un message
// ============================================

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function MessageConfirmationModal({ username }: { username: string; }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleConfirm = () => {
        setIsOpen(false);
        navigate(`/messages?u=${username}`);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-[#EC3558] text-white rounded-lg hover:bg-[#EC3558]/90 transition-colors"
            >
                Message
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Envoyer un message à @{username} ?</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 justify-end mt-4">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 bg-[#EC3558] text-white rounded-lg hover:bg-[#EC3558]/90"
                        >
                            Continuer
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

// ============================================
// EXEMPLE 8 : Créer une conversation directement avec l'API
// ============================================

export async function createConversationWithUser(userId: string): Promise<string> {
    try {
        const conversation = await messageService.getOrCreateConversation(userId);
        return conversation.id;
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }
}

// Utilisation
async function handleMessageButtonClick(userId: string) {
    try {
        const conversationId = await createConversationWithUser(userId);
        console.log('Conversation created:', conversationId);
        // Rediriger vers la page des messages
        window.location.href = '/messages';
    } catch (error) {
        alert('Impossible de créer une conversation');
    }
}

// ============================================
// EXEMPLE 9 : Dropdown menu avec option "Message"
// ============================================

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

export function UserDropdownMenu({ username }: { username: string; }) {
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <MoreVertical className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate(`/@${username}`)}>
                    Voir le profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/messages?u=${username}`)}>
                    Envoyer un message
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Suivre
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/*
 * ============================================
 * 💡 CONSEILS D'UTILISATION
 * ============================================
 * 
 * 1. Utilisez toujours le format `/messages?u=${username}` pour ouvrir une conversation
 * 2. La conversation sera créée automatiquement si elle n'existe pas
 * 3. Utilisez le hook `useUnreadCount()` pour afficher un badge de messages non lus
 * 4. Les icônes lucide-react recommandées : MessageCircle, Send, Mail
 * 5. Testez toujours avec deux utilisateurs différents pour voir les messages en temps réel
 * 
 * ============================================
 * 🎨 DESIGN TOKENS
 * ============================================
 * 
 * Couleur principale: #EC3558 (rouge Instagram)
 * Couleur hover: #EC3558/90 (rouge avec 90% d'opacité)
 * Couleur texte: text-gray-700
 * Couleur texte secondaire: text-gray-500
 * 
 */
