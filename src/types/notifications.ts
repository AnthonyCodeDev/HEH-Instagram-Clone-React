// Types de notifications
export type NotificationType = 'LIKE' | 'COMMENT' | 'FOLLOW' | 'SYSTEM';

// Payload pour les notifications de type LIKE
export interface LikeNotificationPayload {
    postId: string;
    likerId: string;
    likerUsername: string;
}

// Payload pour les notifications de type COMMENT
export interface CommentNotificationPayload {
    postId: string;
    commentId: string;
    commenterId: string;
    commenterUsername: string;
    commentText: string;
}

// Payload pour les notifications de type FOLLOW
export interface FollowNotificationPayload {
    followerId: string;
    followerUsername: string;
}

// Payload pour les notifications système
export interface SystemNotificationPayload {
    message: string;
}

// Union type pour tous les types de payload
export type NotificationPayload =
    | LikeNotificationPayload
    | CommentNotificationPayload
    | FollowNotificationPayload
    | SystemNotificationPayload;

// Type pour une notification
export interface Notification {
    id: string;
    type: NotificationType;
    payload: NotificationPayload;
    read: boolean;
    createdAt: string;
}

// Type pour la réponse de l'API de notifications
export interface NotificationsResponse {
    notifications: Notification[];
    unreadCount: number;
    page: number;
    size: number;
    hasMore: boolean;
}
