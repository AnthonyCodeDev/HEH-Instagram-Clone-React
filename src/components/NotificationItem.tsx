import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Heart, MessageSquare, UserPlus, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Notification, NotificationType } from '@/types/notifications';
import { markNotificationAsRead } from '@/services/notificationService';
import { toast } from '@/components/ui/use-toast';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Formater la date relative (ex: "il y a 2 heures")
    const formattedDate = formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
        locale: fr
    });

    // Date complète au format "20 oct. 2025 à 14:30" pour le tooltip
    const fullDate = format(new Date(notification.createdAt), "d MMM yyyy 'à' HH:mm", {
        locale: fr
    });

    // Gérer le clic qui doit marquer comme lu (utilisé par les liens aussi)
    const handleClick = async (e?: React.MouseEvent) => {
        // si appelé depuis un bouton ou un lien, on laisse la navigation se produire
        if (e) e.stopPropagation();

        if (!notification.read) {
            try {
                setIsLoading(true);
                await markNotificationAsRead(notification.id);
                onMarkAsRead(notification.id);
            } catch (error) {
                toast({
                    title: "Erreur",
                    description: "Impossible de marquer la notification comme lue",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Clic spécifique sur la petite "case" (dot) : marquer comme lu, mais ne pas rediriger
    const handleDotClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!notification.read) {
            try {
                setIsLoading(true);
                await markNotificationAsRead(notification.id);
                onMarkAsRead(notification.id);
            } catch (error) {
                toast({
                    title: "Erreur",
                    description: "Impossible de marquer la notification comme lue",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Déterminer l'URL de destination en fonction du type de notification
    const getDestinationUrl = () => {
        switch (notification.type) {
            case 'LIKE':
                return `/p/${(notification.payload as any).postId}`;
            case 'COMMENT':
                return `/p/${(notification.payload as any).postId}`;
            case 'FOLLOW':
                return `/u/${(notification.payload as any).followerUsername}`;
            default:
                return '/notifications';
        }
    };

    // Déterminer l'icône en fonction du type de notification
    const getIcon = () => {
        switch (notification.type) {
            case 'LIKE':
                return <Heart className="h-4 w-4 text-red-500" />;
            case 'COMMENT':
                return <MessageSquare className="h-4 w-4 text-blue-500" />;
            case 'FOLLOW':
                return <UserPlus className="h-4 w-4 text-green-500" />;
            case 'SYSTEM':
                return <Bell className="h-4 w-4 text-purple-500" />;
            default:
                return <Bell className="h-4 w-4 text-gray-500" />;
        }
    };

    // Déterminer le texte de la notification en utilisant les clés présentes dans le payload
    const getNotificationText = () => {
        const payload: any = notification.payload || {};
        const actor = payload.likerUsername || payload.commenterUsername || payload.followerUsername || payload.authorUsername || payload.username || '';
        const actorDisplay = actor ? `@${actor}` : 'Quelqu\'un';

        switch (notification.type) {
            case 'LIKE':
                return (
                    <span>
                        <span className="font-medium">{actorDisplay}</span> a aimé votre publication
                    </span>
                );
            case 'COMMENT':
                return (
                    <span>
                        <span className="font-medium">{actorDisplay}</span> a commenté : "{payload.commentText || ''}"
                    </span>
                );
            case 'FOLLOW':
                return (
                    <span>
                        <span className="font-medium">{actorDisplay}</span> a commencé à vous suivre
                    </span>
                );
            case 'SYSTEM':
                return (
                    <span>
                        {payload.message}
                    </span>
                );
            default:
                return <span>Notification</span>;
        }
    };

    // Déterminer l'avatar en utilisant les champs disponibles dans le payload
    const getAvatarInfo = () => {
        const payload: any = notification.payload || {};

        // Rassembler toutes les variantes possibles de username
        const username = payload.likerUsername || payload.commenterUsername || payload.followerUsername || payload.authorUsername || payload.username || '';

        // Rassembler toutes les variantes possibles d'URL d'avatar
        const avatarUrl = payload.likerAvatarUrl || payload.commenterAvatarUrl || payload.followerAvatarUrl || payload.authorAvatarUrl || payload.avatarUrl || payload.likerAvatar || payload.commenterAvatar || payload.followerAvatar || payload.authorAvatar || undefined;

        // fallback : première lettre en minuscule (ex: 'a' pour 'anthony')
        const fallback = username && typeof username === 'string' && username.length > 0 ? username[0].toLowerCase() : 'a';

        // Username affichable (fallback à 'Stragram' si absent)
        const displayName = username || 'Stragram';

        return { username: displayName, fallback, avatarUrl };
    };

    const avatarInfo = getAvatarInfo();

    return (
        <div
            className={cn(
                "flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0",
                notification.read ? "bg-white" : "bg-blue-50",
                isLoading && "opacity-70 pointer-events-none"
            )}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <Link to={getDestinationUrl()} onClick={handleClick} className="shrink-0 relative">
                <Avatar className="w-10 h-10">
                    {avatarInfo.avatarUrl ? (
                        <AvatarImage src={avatarInfo.avatarUrl} alt={avatarInfo.username} />
                    ) : null}
                    <AvatarFallback className={avatarInfo.avatarUrl ? '' : 'bg-gray-100 text-gray-700'}>{avatarInfo.fallback}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                    {getIcon()}
                </div>
            </Link>

            <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-700">
                    <Link to={getDestinationUrl()} onClick={handleClick} className="hover:underline">
                        {getNotificationText()}
                    </Link>
                </div>
                <div className="text-xs text-gray-500 mt-1" title={fullDate}>
                    {formattedDate}
                </div>
            </div>

            {!notification.read ? (
                <button
                    aria-label="Marquer la notification comme lue"
                    onClick={handleDotClick}
                    className="shrink-0 w-3 h-3 rounded-full bg-stragram-primary mt-2 focus:outline-none"
                />
            ) : null}
        </div>
    );
};

export default NotificationItem;
