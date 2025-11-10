import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { MessageDto, SendMessageRequest, TypingNotification, ConversationDeletedNotification } from '../types/message';

// ⚠️ IMPORTANT : Vérifiez que votre backend WebSocket est bien sur ce port
// Si votre backend principal est sur 8081, changez cette URL
const WS_URL = 'http://localhost:8081/ws';  // Changé de 8080 à 8081 pour correspondre au backend principal

interface UseWebSocketReturn {
    isConnected: boolean;
    sendMessage: (message: SendMessageRequest) => void;
    sendTyping: (receiverId: string) => void;
    error: string | null;
}

interface UseWebSocketOptions {
    enabled?: boolean; // Nouveau : permet de désactiver la connexion
}

/**
 * Hook personnalisé pour gérer la connexion WebSocket et les interactions de messagerie
 * 
 * @param onMessageReceived - Callback appelé quand un nouveau message est reçu
 * @param onTypingReceived - Callback appelé quand une notification de frappe est reçue
 * @param onConversationDeleted - Callback appelé quand une conversation est supprimée
 * @param options - Options de configuration (enabled, etc.)
 */
export const useWebSocket = (
    onMessageReceived: (message: MessageDto) => void,
    onTypingReceived?: (typing: TypingNotification) => void,
    onConversationDeleted?: (notification: ConversationDeletedNotification) => void,
    options: UseWebSocketOptions = { enabled: true }
): UseWebSocketReturn => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const clientRef = useRef<Client | null>(null);
    const { enabled = true } = options;

    useEffect(() => {
        // Ne pas se connecter si désactivé
        if (!enabled) {
            // console.log('⏸️ [WebSocket] Connexion désactivée (backend non disponible)');
            setIsConnected(false);
            setError(null); // Pas d'erreur si simplement désactivé
            return;
        }

        // console.log('🔌 [WebSocket] Initialisation de la connexion...');
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('❌ [WebSocket] Pas de token JWT');
            setError('No authentication token');
            return;
        }

        // console.log('🔑 [WebSocket] Token présent, création du client STOMP...');
        // console.log('📍 [WebSocket] URL:', WS_URL);

        // Créer le client STOMP avec SockJS
        const client = new Client({
            webSocketFactory: () => {
                // console.log('🏭 [WebSocket] Création de la factory SockJS...');
                return new SockJS(WS_URL);
            },
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            debug: (str) => {
                // console.log('[STOMP]', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                // console.log('✅ [WebSocket] CONNECTÉ avec succès !');
                setIsConnected(true);
                setError(null);

                // console.log('📡 [WebSocket] Souscription à /user/queue/messages...');
                // S'abonner aux messages privés
                client.subscribe('/user/queue/messages', (message) => {
                    try {
                        const messageDto: MessageDto = JSON.parse(message.body);
                        // console.log('📨 [WebSocket] Message reçu:', messageDto);
                        onMessageReceived(messageDto);
                    } catch (err) {
                        console.error('❌ [WebSocket] Erreur parsing message:', err);
                    }
                });

                // S'abonner aux notifications de frappe (typing)
                if (onTypingReceived) {
                    // console.log('⌨️ [WebSocket] Souscription à /user/queue/typing...');
                    client.subscribe('/user/queue/typing', (message) => {
                        try {
                            const typingNotification: TypingNotification = JSON.parse(message.body);
                            // console.log('⌨️ [WebSocket] Typing reçu:', typingNotification);
                            onTypingReceived(typingNotification);
                        } catch (err) {
                            console.error('❌ [WebSocket] Erreur parsing typing:', err);
                        }
                    });
                }

                // S'abonner aux suppressions de conversations
                if (onConversationDeleted) {
                    // console.log('🗑️ [WebSocket] Souscription à /user/queue/conversation-deleted...');
                    client.subscribe('/user/queue/conversation-deleted', (message) => {
                        try {
                            const notification: ConversationDeletedNotification = JSON.parse(message.body);
                            console.log('🗑️ [WebSocket] Conversation supprimée reçue:', notification);
                            onConversationDeleted(notification);
                        } catch (err) {
                            console.error('❌ [WebSocket] Erreur parsing conversation deleted:', err);
                        }
                    });
                }
            },
            onStompError: (frame) => {
                console.error('❌ [WebSocket] Erreur STOMP:', frame.headers['message']);
                console.error('📋 [WebSocket] Détails:', frame.body);
                setError(frame.headers['message'] || 'WebSocket error');
                setIsConnected(false);
            },
            onWebSocketClose: () => {
                // console.log('🔌 [WebSocket] Connexion fermée');
                setIsConnected(false);
            },
            onWebSocketError: (event) => {
                console.error('❌ [WebSocket] Erreur WebSocket:', event);
                setError('WebSocket connection error');
            }
        });

        clientRef.current = client;
        // console.log('▶️ [WebSocket] Activation du client...');
        client.activate();

        // Cleanup lors du démontage
        return () => {
            if (client.active) {
                // console.log('🔌 Disconnecting WebSocket...');
                client.deactivate();
            }
        };
    }, [onMessageReceived, onTypingReceived, onConversationDeleted, enabled]); // Ajouter enabled dans les dépendances

    /**
     * Envoie un message via WebSocket
     */
    const sendMessage = useCallback((message: SendMessageRequest) => {
        if (!clientRef.current?.connected) {
            console.error('❌ Cannot send message: WebSocket not connected');
            setError('Not connected to WebSocket');
            return;
        }

        if (!message.content.trim()) {
            console.error('❌ Cannot send empty message');
            return;
        }

        if (message.content.length > 1000) {
            console.error('❌ Message too long (max 1000 characters)');
            setError('Message too long (max 1000 characters)');
            return;
        }

        try {
            clientRef.current.publish({
                destination: '/app/chat.send',
                body: JSON.stringify(message)
            });
            // console.log('📤 Message sent:', message);
        } catch (err) {
            console.error('❌ Error sending message:', err);
            setError('Failed to send message');
        }
    }, []);

    /**
     * Envoie une notification de frappe (typing)
     */
    const sendTyping = useCallback((receiverId: string) => {
        if (!clientRef.current?.connected) {
            return;
        }

        try {
            clientRef.current.publish({
                destination: '/app/chat.typing',
                body: JSON.stringify({ receiverId })
            });
            // console.log('⌨️ Typing notification sent to:', receiverId);
        } catch (err) {
            console.error('❌ Error sending typing notification:', err);
        }
    }, []);

    return {
        isConnected,
        sendMessage,
        sendTyping,
        error
    };
};
