import { Link, useLocation } from "react-router-dom";
import { HomeIcon, NotificationIcon, MessageIcon, ProfileIcon, SettingsIcon } from "./SidebarIcons";

const MobileNavbar = () => {
    const location = useLocation();

    const menuItems = [
        { icon: HomeIcon, path: "/", label: "Accueil" },
        { icon: NotificationIcon, path: "/notifications", label: "Notifications" },
        { icon: MessageIcon, path: "/messages", label: "Messages" },
        { icon: ProfileIcon, path: "/u/bahsonnom", label: "Profil" },
        { icon: SettingsIcon, path: "/settings", label: "Paramètres" }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 md:hidden">
            <div className="flex justify-around items-center h-16">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex flex-col items-center justify-center w-full h-full"
                        >
                            <div className="flex-shrink-0">
                                <Icon isActive={isActive} />
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
