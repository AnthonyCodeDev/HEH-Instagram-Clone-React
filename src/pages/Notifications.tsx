import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, UserPlus, Camera, Settings } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'post';
  user: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  content?: string;
  postImage?: string;
  timestamp: string;
  read: boolean;
}

const notifications: NotificationItem[] = [
  {
    id: '1',
    type: 'like',
    user: {
      name: 'Marie Marind',
      username: 'mariemaring',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    },
    content: 'a aimé votre publication',
    postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    timestamp: 'Il y a 2 minutes',
    read: false,
  },
  {
    id: '2',
    type: 'follow',
    user: {
      name: 'Tom Berton',
      username: 'tomberton',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
    content: 'a commencé à vous suivre',
    timestamp: 'Il y a 15 minutes',
    read: false,
  },
  {
    id: '3',
    type: 'comment',
    user: {
      name: 'Lucie Marinier',
      username: 'luciemarinier10',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
    },
    content: 'a commenté votre publication : "Magnifique coucher de soleil ! 🌅"',
    postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    timestamp: 'Il y a 1 heure',
    read: false,
  },
  {
    id: '4',
    type: 'like',
    user: {
      name: 'Alex Martin',
      username: 'alexmartin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      verified: true,
    },
    content: 'et 12 autres personnes ont aimé votre publication',
    postImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    timestamp: 'Il y a 3 heures',
    read: true,
  },
  {
    id: '5',
    type: 'mention',
    user: {
      name: 'Sophie Durand',
      username: 'sophiedurand',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
    },
    content: 'vous a mentionné dans un commentaire',
    timestamp: 'Il y a 6 heures',
    read: true,
  },
  {
    id: '6',
    type: 'follow',
    user: {
      name: 'Julia Brown',
      username: 'juliabrown',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    },
    content: 'a commencé à vous suivre',
    timestamp: 'Hier',
    read: true,
  },
  {
    id: '7',
    type: 'like',
    user: {
      name: 'Marc Petit',
      username: 'marcpetit',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
    content: 'et 8 autres personnes ont aimé votre publication',
    postImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    timestamp: 'Hier',
    read: true,
  },
];

const getNotificationIcon = (type: NotificationItem['type']) => {
  switch (type) {
    case 'like':
      return <Heart className="w-4 h-4 text-red-500" />;
    case 'comment':
      return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case 'follow':
      return <UserPlus className="w-4 h-4 text-green-500" />;
    case 'mention':
      return <MessageCircle className="w-4 h-4 text-purple-500" />;
    case 'post':
      return <Camera className="w-4 h-4 text-orange-500" />;
    default:
      return null;
  }
};

const Notifications = () => {
  const [notificationList, setNotificationList] = useState(notifications);
  const unreadCount = notificationList.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotificationList(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''} notification{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  Tout marquer comme lu
                </Button>
              )}
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-1">
            {notificationList.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl p-4 transition-smooth hover:bg-gray-50 cursor-pointer ${!notification.read ? 'shadow-sm' : ''
                  }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <Link to={`/user/${notification.user.username}`} className="relative">
                    <Avatar className="w-12 h-12 hover:opacity-80 transition-smooth">
                      <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                      <AvatarFallback>
                        {notification.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    {/* Notification Icon */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            to={`/user/${notification.user.username}`}
                            className="font-semibold text-gray-900 hover:text-stragram-primary transition-smooth"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {notification.user.name}
                          </Link>
                          {notification.user.verified && (
                            <Badge variant="destructive" className="w-4 h-4 p-0 bg-stragram-primary">
                              ✓
                            </Badge>
                          )}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-stragram-primary rounded-full"></div>
                          )}
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed">
                          {notification.content}
                        </p>

                        <p className="text-xs text-gray-500 mt-2">
                          {notification.timestamp}
                        </p>
                      </div>

                      {/* Post Thumbnail */}
                      {notification.postImage && (
                        <div className="ml-4 flex-shrink-0">
                          <img
                            src={notification.postImage}
                            alt="Post"
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {notification.type === 'follow' && (
                      <div className="mt-3">
                        <Button variant="stragram" size="sm" className="h-8 px-4 text-xs">
                          Suivre en retour
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {notificationList.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune notification
              </h3>
              <p className="text-gray-600">
                Vos notifications apparaîtront ici lorsque quelqu'un interagira avec votre contenu.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;