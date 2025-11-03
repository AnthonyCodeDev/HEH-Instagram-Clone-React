import { Notification, NotificationsResponse } from '@/types/notifications';

const API_URL = 'http://localhost:8081';

/**
 * Récupère les notifications de l'utilisateur connecté
 * @param page Numéro de page (défaut: 0)
 * @param size Nombre de notifications par page (défaut: 20)
 * @returns Réponse contenant les notifications et les métadonnées
 */
export const fetchNotifications = async (page: number = 0, size: number = 20): Promise<NotificationsResponse> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Non authentifié');
    }

    const response = await fetch(`${API_URL}/notifications?page=${page}&size=${size}`, {
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

    return await response.json();
};

/**
 * Marque une notification spécifique comme lue
 * @param notificationId ID de la notification à marquer comme lue
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Non authentifié');
    }

    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erreur ${response.status}`);
    }
};

/**
 * Marque toutes les notifications de l'utilisateur comme lues
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Non authentifié');
    }

    const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erreur ${response.status}`);
    }
};

/**
 * Crée une notification pour un utilisateur destinataire
 * @param recipientId ID de l'utilisateur destinataire
 * @param type Type de notification (ex: 'COMMENT')
 * @param payload Payload spécifique au type
 */
