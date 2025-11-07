import { ConversationDto, MessageDto, SendMessageRequest } from '../types/message';

// ⚠️ IMPORTANT : Vérifiez que votre backend de messagerie est bien sur ce port
// Si votre backend principal est sur 8081, changez cette URL
const API_URL = 'http://localhost:8081';  // Changé de 8080 à 8081 pour correspondre au backend principal
const API_BASE = `${API_URL}/api/messages`;

/**
 * Service pour gérer les appels REST de l'API de messagerie
 */
export const messageService = {
    /**
     * Récupère la liste de toutes les conversations
     */
    async getConversations(): Promise<ConversationDto[]> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');

        console.log('🔍 [MessageService] Tentative de récupération des conversations...');
        console.log('📍 [MessageService] URL:', `${API_BASE}/conversations`);
        console.log('🔑 [MessageService] Token présent:', !!token);

        try {
            const response = await fetch(`${API_BASE}/conversations`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('📡 [MessageService] Réponse reçue:', {
                status: response.status,
                statusText: response.statusText,
                contentType: response.headers.get('content-type')
            });

            if (!response.ok) {
                // Vérifier si c'est une erreur 404 (endpoint non implémenté)
                if (response.status === 404) {
                    console.warn('⚠️ [MessageService] Endpoint 404 - Backend non implémenté');
                    return []; // Retourner un tableau vide au lieu de planter
                }
                console.error('❌ [MessageService] Erreur HTTP:', response.status);
                throw new Error(`Failed to fetch conversations: ${response.status}`);
            }

            // Vérifier si la réponse est bien du JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn('⚠️ [MessageService] Réponse non-JSON reçue:', contentType);
                return []; // Retourner un tableau vide
            }

            const data = await response.json();
            console.log('✅ [MessageService] Conversations chargées:', data.length, 'conversations');
            return data;
        } catch (error) {
            console.error('❌ [MessageService] Erreur lors du fetch:', error);
            // Si c'est une erreur de parsing JSON, le backend n'est probablement pas prêt
            if (error instanceof SyntaxError) {
                console.warn('⚠️ [MessageService] Erreur de parsing JSON - Backend non prêt');
                return []; // Retourner un tableau vide au lieu de throw
            }
            throw error;
        }
    },

    /**
     * Créer ou récupérer une conversation avec un utilisateur
     */
    async getOrCreateConversation(userId: string): Promise<ConversationDto> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');

        try {
            const response = await fetch(`${API_BASE}/conversations/with/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to create/get conversation: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating/getting conversation:', error);
            throw error;
        }
    },

    /**
     * Récupère tous les messages d'une conversation
     */
    async getConversationMessages(conversationId: string): Promise<MessageDto[]> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');

        try {
            const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch messages: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    },

    /**
     * Marque tous les messages d'une conversation comme lus
     */
    async markAsRead(conversationId: string): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');

        try {
            const response = await fetch(`${API_BASE}/conversations/${conversationId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to mark as read: ${response.status}`);
            }
        } catch (error) {
            console.error('Error marking messages as read:', error);
            throw error;
        }
    },

    /**
     * Récupère le nombre total de messages non lus
     */
    async getUnreadCount(): Promise<number> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');

        try {
            const response = await fetch(`${API_BASE}/unread-count`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch unread count: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching unread count:', error);
            throw error;
        }
    },

    /**
     * Supprime une conversation (des deux côtés)
     */
    async deleteConversation(conversationId: string): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');

        console.log('🗑️ [MessageService] Suppression de la conversation:', conversationId);

        try {
            const response = await fetch(`${API_BASE}/conversations/${conversationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to delete conversation: ${response.status}`);
            }

            console.log('✅ [MessageService] Conversation supprimée');
        } catch (error) {
            console.error('❌ [MessageService] Erreur suppression conversation:', error);
            throw error;
        }
    }
};
