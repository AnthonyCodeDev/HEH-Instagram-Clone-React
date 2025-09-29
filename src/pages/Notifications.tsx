import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, UserPlus, Camera, Settings } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import QuickAdd from "@/components/QuickAdd";
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex max-w-none h-full">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                {unreadCount > 0 && (
                  <div className="bg-stragram-primary text-white text-sm font-medium px-3 py-1 rounded-full">
                    {unreadCount}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-stragram-primary hover:text-stragram-primary/80 hover:bg-stragram-primary/10"
                  >
                    Tout marquer comme lu
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-2">
              {notificationList.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative bg-white rounded-2xl p-5 transition-all duration-200 hover:bg-gray-50 cursor-pointer border border-gray-100 ${!notification.read ? 'border-stragram-primary/20 bg-stragram-primary/5' : ''
                    }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <Link to={`/user/${notification.user.username}`} className="relative flex-shrink-0">
                      <Avatar className="w-14 h-14 hover:scale-105 transition-transform duration-200 ring-2 ring-white shadow-sm">
                        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                          {notification.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Notification Icon */}
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Link
                              to={`/user/${notification.user.username}`}
                              className="font-semibold text-gray-900 hover:text-stragram-primary transition-colors text-base"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {notification.user.name}
                            </Link>
                            {notification.user.verified && (
                              <Badge variant="destructive" className="w-4 h-4 p-0 bg-stragram-primary">
                                ✓
                              </Badge>
                            )}
                            <span className="text-gray-500 text-sm">•</span>
                            <span className="text-gray-500 text-sm">
                              {notification.timestamp}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-stragram-primary rounded-full ml-auto"></div>
                            )}
                          </div>

                          <p className="text-gray-700 leading-relaxed">
                            {notification.content}
                          </p>
                        </div>

                        {/* Post Thumbnail */}
                        {notification.postImage && (
                          <div className="ml-4 flex-shrink-0">
                            <img
                              src={notification.postImage}
                              alt="Post"
                              className="w-16 h-16 rounded-xl object-cover shadow-sm hover:shadow-md transition-shadow"
                            />
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {notification.type === 'follow' && (
                        <div className="mt-4">
                          <Button variant="stragram" size="sm" className="h-9 px-6 text-sm font-medium">
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

        {/* Right Sidebar */}
        <div className="w-96 p-6 flex-shrink-0 overflow-y-auto">
          <QuickAdd />
        </div>
      </div>
    </div>
  );
};

export default Notifications;