// Types pour la messagerie WebSocket

export interface MessageDto {
    id: string;                     // UUID
    conversationId: string;         // UUID
    senderId: string;               // UUID
    senderUsername: string;         // "john_doe"
    senderAvatarUrl: string;        // URL
    content: string;                // Le message
    sentAt: string;                 // ISO date
    isRead: boolean;                // Lu ou non
    readAt: string | null;          // Quand lu
}

export interface ConversationDto {
    id: string;                     // UUID
    otherUserId: string;            // UUID de l'autre utilisateur
    otherUserUsername: string;      // "john_doe"
    otherUserAvatarUrl: string;     // URL avatar
    lastMessage: MessageDto | null; // Dernier message
    unreadCount: number;            // Nombre de non lus
    createdAt: string;              // ISO date
    updatedAt: string;              // ISO date
}

export interface SendMessageRequest {
    receiverId: string;             // UUID (requis)
    content: string;                // Max 1000 chars (requis)
}

export interface TypingNotification {
    userId: string;                 // UUID de l'utilisateur qui écrit
    username: string;               // Nom d'utilisateur
    conversationId: string;         // UUID de la conversation
    isTyping: boolean;              // true si en train d'écrire
}
