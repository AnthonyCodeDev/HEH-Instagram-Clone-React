import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Bell, 
  MessageCircle, 
  User, 
  Settings, 
  LogOut,
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { icon: Home, label: "Accueil", path: "/home", badge: null },
  { icon: Bell, label: "Notifications", path: "/notifications", badge: null },
  { icon: MessageCircle, label: "Messages", path: "/messages", badge: "9" },
  { icon: User, label: "Profil", path: "/profile", badge: null },
  { icon: Settings, label: "Paramètres", path: "/settings", badge: null },
];

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-white border-r border-gray-100 h-screen flex flex-col transition-smooth ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-900">Stragram</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-smooth"
          >
            <ChevronRight className={`w-4 h-4 transition-smooth ${
              isCollapsed ? 'rotate-0' : 'rotate-180'
            }`} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth ${
                    isActive 
                      ? 'bg-stragram-primary/10 text-stragram-primary font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="destructive" 
                          className="h-5 w-5 flex items-center justify-center text-xs p-0"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  {isActive && (
                    <div className="w-1 h-6 bg-stragram-primary rounded-full absolute right-0" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          asChild
        >
          <Link to="/">
            <LogOut className="w-5 h-5 mr-3" />
            {!isCollapsed && "Déconnexion"}
          </Link>
        </Button>
        
        {!isCollapsed && (
          <Button 
            variant="stragram" 
            className="w-full mt-3"
          >
            PUBLIER
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;