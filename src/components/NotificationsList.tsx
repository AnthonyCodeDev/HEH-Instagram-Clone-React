import { useState, useEffect } from 'react';
import { Loader2, Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Notification } from '@/types/notifications';
import { fetchNotifications, markAllNotificationsAsRead } from '@/services/notificationService';
import NotificationItem from './NotificationItem';

interface NotificationsListProps {
    onClose?: () => void;
}

const NotificationsList = ({ onClose }: NotificationsListProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    // Charger les notifications au montage du composant
    useEffect(() => {
        loadNotifications();
    }, []);

    // Fonction pour charger les notifications
    const loadNotifications = async (pageNum = 0) => {
        try {
            setIsLoading(pageNum === 0);
            setIsLoadingMore(pageNum > 0);

            const response = await fetchNotifications(pageNum);

            if (pageNum === 0) {
                setNotifications(response.notifications);
            } else {
                setNotifications(prev => [...prev, ...response.notifications]);
            }

            setUnreadCount(response.unreadCount);
            setPage(response.page);
            setHasMore(response.hasMore);
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de charger les notifications",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Fonction pour charger plus de notifications
    const loadMore = () => {
        if (hasMore && !isLoadingMore) {
            loadNotifications(page + 1);
        }
    };

    // Fonction pour marquer une notification comme lue
    const handleMarkAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );

        // Mettre à jour le compteur de notifications non lues
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    // Fonction pour marquer toutes les notifications comme lues
    const handleMarkAllAsRead = async () => {
        try {
            setIsMarkingAllRead(true);
            await markAllNotificationsAsRead();

            // Mettre à jour l'état local
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, read: true }))
            );
            setUnreadCount(0);

            toast({
                title: "Succès",
                description: "Toutes les notifications ont été marquées comme lues"
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de marquer toutes les notifications comme lues",
                variant: "destructive"
            });
        } finally {
            setIsMarkingAllRead(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* En-tête */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-stragram-primary" />
                    <h2 className="font-semibold text-lg">Notifications</h2>
                    {unreadCount > 0 && (
                        <span className="bg-stragram-primary text-white text-xs rounded-full px-2 py-0.5">
                            {unreadCount}
                        </span>
                    )}
                </div>

                {unreadCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        disabled={isMarkingAllRead}
                        className="text-xs flex items-center gap-1"
                    >
                        {isMarkingAllRead ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                            <CheckCheck className="h-3 w-3" />
                        )}
                        Tout marquer comme lu
                    </Button>
                )}
            </div>

            {/* Liste des notifications */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full p-8">
                        <Loader2 className="h-8 w-8 text-stragram-primary animate-spin" />
                        <p className="text-gray-500 mt-4">Chargement des notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <Bell className="h-12 w-12 text-gray-300" />
                        <p className="text-gray-500 mt-4">Vous n'avez pas de notifications pour le moment</p>
                    </div>
                ) : (
                    <>
                        {notifications.map(notification => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                            />
                        ))}

                        {hasMore && (
                            <div className="p-4 text-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={loadMore}
                                    disabled={isLoadingMore}
                                    className="w-full"
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Chargement...
                                        </>
                                    ) : (
                                        "Voir plus"
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NotificationsList;
