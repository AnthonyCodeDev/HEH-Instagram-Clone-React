import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, NotificationIcon, MessageIcon, ProfileIcon, SettingsIcon } from "./SidebarIcons";
import { messageService } from "@/services/messageService";

const MobileNavbar = () => {
    const location = useLocation();
    const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);

    const username = localStorage.getItem('username') || '';

    const menuItems = [
        { icon: HomeIcon, path: "/", label: "Accueil" },
        { icon: NotificationIcon, path: "/notifications", label: "Notifications" },
        { icon: MessageIcon, path: "/messages", label: "Messages" },
        { icon: ProfileIcon, path: `/u/${username}`, label: "Profil" },
        { icon: SettingsIcon, path: "/settings", label: "Paramètres" }
    ];

    // Charger le nombre de messages non lus
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const count = await messageService.getUnreadCount();
                setUnreadMessagesCount(count);
            } catch (error) {
                // Silencieusement ignorer les erreurs (backend pas encore prêt)
                setUnreadMessagesCount(0);
            }
        };

        fetchUnreadCount();

        // Recharger toutes les 30 secondes
        const interval = setInterval(fetchUnreadCount, 30000);

        // Écouter l'événement personnalisé pour rafraîchir immédiatement
        const handleUnreadChanged = () => {
            fetchUnreadCount();
        };
        window.addEventListener('unreadMessagesChanged', handleUnreadChanged);

        return () => {
            clearInterval(interval);
            window.removeEventListener('unreadMessagesChanged', handleUnreadChanged);
        };
    }, []);

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 md:hidden">
            <div className="flex justify-around items-center h-16">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    const showBadge = item.label === "Messages" && unreadMessagesCount > 0;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex flex-col items-center justify-center w-full h-full"
                        >
                            <div className="flex-shrink-0 relative">
                                <Icon isActive={isActive} />
                                {showBadge && (
                                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#EC3558] border-2 border-white rounded-full flex items-center justify-center">
                                        <span className="text-white text-[11px] font-bold">
                                            {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <span
                                className="text-xs mt-1"
                                style={{
                                    fontFamily: '"SF Pro", sans-serif',
                                    fontWeight: 500,
                                    color: isActive ? '#252525' : '#8A96A3'
                                }}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileNavbar;
