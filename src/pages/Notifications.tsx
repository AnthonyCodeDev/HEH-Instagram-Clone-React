import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, UserPlus, Camera, Settings, Trash2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import RightBar from "@/components/RightBar";
import MobileNavbar from "@/components/MobileNavbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'post';
  user: {
    name: string;
    username: string;
    avatar: string;
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

  const deleteAllNotifications = () => {
    setNotificationList([]);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col md:flex-row max-w-none h-full overflow-x-hidden">
        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-y-auto w-full">
          <div className="w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1
                className="font-medium capitalize"
                style={{
                  fontFamily: '"SF Pro", sans-serif',
                  fontSize: '19px',
                  fontWeight: 590,
                  color: '#252525',
                  textAlign: 'center',
                  textTransform: 'capitalize'
                }}
              >
                Notifications
              </h1>

              <div className="flex items-center gap-1 sm:gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={markAllAsRead}
                    className="text-stragram-primary hover:text-stragram-primary/80 hover:bg-stragram-primary/10 px-2 sm:px-4 py-2 text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">Tout marquer comme lu</span>
                    <span className="sm:hidden">Tout lu</span>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                      <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={deleteAllNotifications}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer toutes les notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-2">
              {notificationList.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative bg-white rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-200 hover:bg-gray-50 cursor-pointer border border-gray-100 ${!notification.read ? 'border-stragram-primary/20 bg-stragram-primary/5' : ''
                    }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    {/* User Avatar */}
                    <Link to={`/u/${notification.user.username}`} className="relative flex-shrink-0">
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 hover:scale-105 transition-transform duration-200 ring-2 ring-white shadow-sm">
                        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                          {notification.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Notification Icon */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                            <Link
                              to={`/u/${notification.user.username}`}
                              className="font-semibold text-gray-900 hover:text-stragram-primary transition-colors text-sm sm:text-base truncate max-w-[150px] sm:max-w-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {notification.user.name}
                            </Link>
                            <span className="text-gray-500 text-xs sm:text-sm">•</span>
                            <span className="text-gray-500 text-xs sm:text-sm">
                              {notification.timestamp}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-stragram-primary rounded-full ml-auto"></div>
                            )}
                          </div>

                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            {notification.content}
                          </p>
                        </div>

                        {/* Post Thumbnail */}
                        {notification.postImage && (
                          <div className="ml-2 sm:ml-3 md:ml-4 flex-shrink-0">
                            <Link
                              to={`/p/${notification.user.username}-photo-${notification.id}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <img
                                src={notification.postImage}
                                alt="Post"
                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg md:rounded-xl object-cover shadow-sm hover:shadow-md transition-shadow"
                              />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {notificationList.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
                  Aucune notification
                </h3>
                <p className="text-sm md:text-base text-gray-600 px-4">
                  Vos notifications apparaîtront ici lorsque quelqu'un interagira avec votre contenu.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - hidden on mobile and small tablets */}
        <div className="hidden lg:block">
          <RightBar />
        </div>
      </div>

      {/* Mobile Navigation Bar - visible only on mobile */}
      <MobileNavbar />
    </div>
  );
};

export default Notifications;