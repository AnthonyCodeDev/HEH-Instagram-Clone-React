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

    // Déterminer le texte de la notification
    const getNotificationText = () => {
        switch (notification.type) {
            case 'LIKE':
                return (
                    <span>
                        <span className="font-medium">@{(notification.payload as any).likerUsername}</span> a aimé votre publication
                    </span>
                );
            case 'COMMENT':
                return (
                    <span>
                        <span className="font-medium">@{(notification.payload as any).commenterUsername}</span> a commenté : "{(notification.payload as any).commentText}"
                    </span>
                );
            case 'FOLLOW':
                return (
                    <span>
                        <span className="font-medium">@{(notification.payload as any).followerUsername}</span> a commencé à vous suivre
                    </span>
                );
            case 'SYSTEM':
                return (
                    <span>
                        {(notification.payload as any).message}
                    </span>
                );
            default:
                return <span>Notification</span>;
        }
    };

    // Déterminer l'avatar en fonction du type de notification
    const getAvatarInfo = () => {
        const payload: any = notification.payload || {};
        const takeFallback = (s: unknown) => {
            if (typeof s === 'string' && s.length > 0) return s.substring(0, 2).toUpperCase();
            return 'ST';
        };

        switch (notification.type) {
            case 'LIKE': {
                const username = payload.likerUsername || 'Stragram';
                return { username, fallback: takeFallback(payload.likerUsername) };
            }
            case 'COMMENT': {
                const username = payload.commenterUsername || 'Stragram';
                return { username, fallback: takeFallback(payload.commenterUsername) };
            }
            case 'FOLLOW': {
                const username = payload.followerUsername || 'Stragram';
                return { username, fallback: takeFallback(payload.followerUsername) };
            }
            default:
                return { username: 'Stragram', fallback: 'ST' };
        }
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
                    <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${avatarInfo.username}`} alt={avatarInfo.username} />
                    <AvatarFallback>{avatarInfo.fallback}</AvatarFallback>
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
