import { useState, useEffect } from 'react';
import { fetchNotifications } from '@/services/notificationService';
import { toast } from '@/components/ui/use-toast';

interface NotificationBadgeProps {
    className?: string;
}

const NotificationBadge = ({ className = '' }: NotificationBadgeProps) => {
    const [unreadCount, setUnreadCount] = useState(0);

    // Charger le nombre de notifications non lues au montage du composant
    useEffect(() => {
        const loadUnreadCount = async () => {
            try {
                // Récupérer les notifications avec une taille minimale pour optimiser la requête
                const response = await fetchNotifications(0, 1);
                setUnreadCount(response.unreadCount);
            } catch (error) {
                // Gérer silencieusement l'erreur
            }
        };

        loadUnreadCount();

        // Rafraîchir le compteur toutes les 2 minutes
        const interval = setInterval(loadUnreadCount, 2 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    // Ne rien afficher s'il n'y a pas de notifications non lues
    if (unreadCount === 0) {
        return null;
    }

    // Formater le nombre pour l'affichage (ex: 99+ si > 99)
    const displayCount = unreadCount > 99 ? '99+' : unreadCount.toString();

    return (
        <div className={`absolute -top-1.5 -right-1.5 min-w-5 h-5 bg-[#EC3558] border-2 border-white rounded-full flex items-center justify-center px-1 ${className}`}>
            <span className="text-white text-[11px] font-bold">{displayCount}</span>
        </div>
    );
};

export default NotificationBadge;
