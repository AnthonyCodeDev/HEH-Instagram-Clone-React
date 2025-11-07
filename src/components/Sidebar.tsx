import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFocusCompose } from "@/hooks/useFocusCompose";
import { useSidebarBreakpoint } from "@/hooks/use-mobile";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeIcon, NotificationIcon, MessageIcon, ProfileIcon, SettingsIcon, LogoutIcon } from "./SidebarIcons";
import { messageService } from "@/services/messageService";


const getMenuItems = () => {
  const username = localStorage.getItem('username') || '';
  return [
    { icon: HomeIcon, label: "Accueil", path: "/" },
    { icon: NotificationIcon, label: "Notifications", path: "/notifications" },
    { icon: MessageIcon, label: "Messages", path: "/messages" },
    { icon: ProfileIcon, label: "Profil", path: `/u/${username}` },
    { icon: SettingsIcon, label: "Paramètres", path: "/settings" },
  ];
};

const Sidebar = () => {
  const location = useLocation();
  const isBelowBreakpoint = useSidebarBreakpoint();
  const { focusCompose } = useFocusCompose();

  // Pour éviter l'animation au chargement initial
  const [hasInitialized, setHasInitialized] = useState(false);

  // État pour le nombre de messages non lus
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);

  // Initialiser isCollapsed en fonction de la taille de l'écran
  // Utiliser useState avec une fonction pour garantir que la valeur initiale est correcte
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return window.innerWidth < 1300;
  });

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

  // Gère l'état de la sidebar en fonction de la largeur de l'écran après le chargement initial
  useEffect(() => {
    // Marquer comme initialisé après le premier rendu
    if (!hasInitialized) {
      setHasInitialized(true);
      return;
    }

    // Animer seulement après le chargement initial
    setIsCollapsed(isBelowBreakpoint);
  }, [isBelowBreakpoint, hasInitialized]);

  return (
    <div className={`bg-white border-r border-gray-100 h-screen flex flex-col ${hasInitialized ? 'transition-all duration-300 ease-in-out' : ''} ${isCollapsed ? 'w-20' : 'w-64'} hidden sm:flex`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center">
              <svg width="100" height="20" viewBox="0 0 121 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.496 19.4845C14.0329 19.4845 12.7549 19.267 11.662 18.832C10.5692 18.397 9.70543 17.7749 9.07085 16.9657C8.44509 16.1566 8.09254 15.1909 8.01322 14.0685L8 13.8728H11.2522L11.2787 14.0294C11.3756 14.5688 11.6136 15.0343 11.9926 15.4258C12.3715 15.8173 12.8695 16.1218 13.4865 16.3393C14.1122 16.5481 14.8217 16.6525 15.6149 16.6525C16.417 16.6525 17.1088 16.5438 17.6905 16.3263C18.2811 16.1088 18.735 15.7999 19.0522 15.3997C19.3695 14.9908 19.5282 14.5166 19.5282 13.9772V13.9641C19.5282 13.2594 19.2594 12.7026 18.7217 12.2936C18.1929 11.8847 17.3116 11.5498 16.0777 11.2887L14.0285 10.8711C12.16 10.4883 10.7587 9.86188 9.82441 8.99184C8.89017 8.1131 8.42305 6.97336 8.42305 5.57259V5.55954C8.43187 4.44589 8.73593 3.4758 9.33526 2.64927C9.9434 1.81403 10.7807 1.16585 11.8471 0.704731C12.9136 0.23491 14.1299 0 15.496 0C16.8797 0 18.0916 0.22621 19.1316 0.67863C20.1716 1.13105 20.9868 1.76183 21.5773 2.57096C22.1767 3.3801 22.5072 4.31974 22.5689 5.38989L22.5821 5.61175H19.3299L19.3034 5.44209C19.2241 4.89396 19.017 4.42849 18.6821 4.04568C18.3472 3.65416 17.9065 3.354 17.36 3.14519C16.8136 2.93638 16.1834 2.83197 15.4695 2.83197C14.7292 2.83197 14.0858 2.94073 13.5393 3.15824C13.0017 3.36705 12.5831 3.66286 12.2834 4.04568C11.9926 4.42849 11.8471 4.87221 11.8471 5.37684V5.38989C11.8471 6.05111 12.1159 6.59054 12.6536 7.00816C13.2 7.41707 14.0461 7.73899 15.1919 7.9739L17.241 8.39152C19.2329 8.80044 20.6828 9.42686 21.5906 10.2708C22.4984 11.106 22.9523 12.2588 22.9523 13.7292V13.7423C22.9523 14.9081 22.6526 15.9217 22.0533 16.783C21.4628 17.6444 20.6078 18.31 19.4885 18.7798C18.378 19.2496 17.0471 19.4845 15.496 19.4845Z" fill="#202020" />
                <path d="M29.8274 19.4323C28.3731 19.4323 27.2891 19.1191 26.5752 18.4927C25.8701 17.8662 25.5175 16.8396 25.5175 15.4127V7.83034H23.5345V5.32463H25.5175V1.81403H28.8623V5.32463H31.4667V7.83034H28.8623V15.1517C28.8623 15.8216 29.0121 16.2871 29.3118 16.5481C29.6203 16.8004 30.0698 16.9266 30.6603 16.9266C30.8277 16.9266 30.9732 16.9222 31.0965 16.9135C31.2287 16.8961 31.3521 16.8831 31.4667 16.8744V19.3148C31.2728 19.3409 31.0348 19.367 30.7528 19.3931C30.4796 19.4192 30.1711 19.4323 29.8274 19.4323Z" fill="#202020" />
                <path d="M33.1859 19.1582V5.32463H36.4645V7.71289H36.5439C36.7554 6.87765 37.1388 6.22512 37.694 5.7553C38.2581 5.27678 38.9456 5.03752 39.7564 5.03752C39.9591 5.03752 40.153 5.05057 40.3381 5.07667C40.5232 5.10277 40.6774 5.13322 40.8008 5.16803V8.1044C40.6686 8.0522 40.4791 8.0087 40.2324 7.9739C39.9944 7.9391 39.7344 7.9217 39.4524 7.9217C38.8354 7.9217 38.3022 8.04785 37.8527 8.30016C37.4032 8.54377 37.0595 8.90484 36.8215 9.38336C36.5835 9.86188 36.4645 10.4448 36.4645 11.1321V19.1582H33.1859Z" fill="#202020" />
                <path d="M45.7722 19.3931C44.8468 19.3931 44.0271 19.2191 43.3132 18.8711C42.6081 18.5144 42.0573 18.0228 41.6607 17.3964C41.2729 16.7613 41.079 16.0348 41.079 15.217V15.1909C41.079 13.9641 41.5417 12.994 42.4671 12.2806C43.4014 11.5585 44.7146 11.1495 46.4068 11.0538L51.7611 10.7276V12.8809L46.8695 13.1811C46.0587 13.2333 45.4373 13.4247 45.0054 13.7553C44.5736 14.0859 44.3576 14.5253 44.3576 15.0734V15.0865C44.3576 15.652 44.5736 16.1001 45.0054 16.4307C45.4461 16.7526 46.0278 16.9135 46.7505 16.9135C47.3851 16.9135 47.9492 16.7874 48.4427 16.5351C48.9451 16.2828 49.3417 15.9391 49.6326 15.5041C49.9234 15.0691 50.0688 14.5775 50.0688 14.0294V9.87928C50.0688 9.18325 49.8441 8.63513 49.3946 8.23491C48.9539 7.82599 48.3149 7.62153 47.4777 7.62153C46.7021 7.62153 46.0807 7.78684 45.6136 8.11746C45.1465 8.43937 44.8556 8.85699 44.741 9.37031L44.7146 9.48777H41.6739L41.6871 9.33116C41.7576 8.51332 42.0353 7.78249 42.52 7.13866C43.0048 6.48613 43.6746 5.97281 44.5295 5.59869C45.3932 5.22458 46.4156 5.03752 47.5966 5.03752C48.7688 5.03752 49.7824 5.22893 50.6373 5.61175C51.5011 5.99456 52.1665 6.52964 52.6336 7.21697C53.1095 7.9043 53.3475 8.71343 53.3475 9.64437V19.1582H50.0688V17.031H49.9895C49.7251 17.5095 49.3814 17.9271 48.9583 18.2838C48.5353 18.6406 48.0505 18.9146 47.5041 19.106C46.9665 19.2974 46.3892 19.3931 45.7722 19.3931Z" fill="#202020" />
                <path d="M61.7959 24C60.562 24 59.4823 23.8303 58.5569 23.491C57.6403 23.1604 56.9087 22.7036 56.3623 22.1207C55.8158 21.5378 55.4765 20.8853 55.3443 20.1631L55.3179 20.0457H58.5436L58.5965 20.1501C58.7728 20.5503 59.1342 20.8809 59.6806 21.1419C60.2359 21.4116 60.9365 21.5465 61.7826 21.5465C62.8579 21.5465 63.682 21.2855 64.2548 20.7635C64.8277 20.2414 65.1142 19.5411 65.1142 18.6623V16.6656H65.0481C64.7925 17.1615 64.4487 17.5878 64.0169 17.9445C63.5938 18.3013 63.0959 18.5797 62.523 18.7798C61.9589 18.9799 61.342 19.0799 60.6721 19.0799C59.4999 19.0799 58.4775 18.7972 57.605 18.2316C56.7413 17.6661 56.0714 16.8657 55.5955 15.8303C55.1284 14.7863 54.8948 13.5465 54.8948 12.1109V12.0979C54.8948 10.6362 55.1328 9.38336 55.6087 8.33931C56.0935 7.28657 56.7721 6.47308 57.6447 5.89886C58.5172 5.32463 59.544 5.03752 60.725 5.03752C61.386 5.03752 61.9942 5.15063 62.5494 5.37684C63.1047 5.59434 63.5894 5.89886 64.0037 6.29038C64.4267 6.68189 64.7704 7.14301 65.0349 7.67374H65.1142V5.32463H68.4061V18.7667C68.4061 19.8108 68.1372 20.7243 67.5996 21.5073C67.062 22.2991 66.2996 22.9125 65.3125 23.3475C64.3254 23.7825 63.1532 24 61.7959 24ZM61.7033 16.5742C62.3908 16.5742 62.9901 16.3959 63.5013 16.0392C64.0125 15.6737 64.4091 15.1604 64.6911 14.4992C64.982 13.838 65.1274 13.0636 65.1274 12.1762V12.1631C65.1274 11.267 64.982 10.4927 64.6911 9.84013C64.4003 9.1789 63.9993 8.66993 63.4881 8.31321C62.9769 7.9565 62.382 7.77814 61.7033 7.77814C60.9982 7.77814 60.3857 7.9565 59.8657 8.31321C59.3457 8.66993 58.9447 9.17455 58.6626 9.82708C58.3806 10.4796 58.2396 11.2583 58.2396 12.1631V12.1762C58.2396 13.081 58.3806 13.8641 58.6626 14.5253C58.9447 15.1778 59.3457 15.6824 59.8657 16.0392C60.3857 16.3959 60.9982 16.5742 61.7033 16.5742Z" fill="#202020" />
                <path d="M70.5615 19.1582V5.32463H73.8402V7.71289H73.9195C74.131 6.87765 74.5144 6.22512 75.0697 5.7553C75.6337 5.27678 76.3212 5.03752 77.132 5.03752C77.3347 5.03752 77.5286 5.05057 77.7137 5.07667C77.8988 5.10277 78.053 5.13322 78.1764 5.16803V8.1044C78.0442 8.0522 77.8547 8.0087 77.608 7.9739C77.37 7.9391 77.11 7.9217 76.828 7.9217C76.211 7.9217 75.6778 8.04785 75.2283 8.30016C74.7788 8.54377 74.4351 8.90484 74.1971 9.38336C73.9591 9.86188 73.8402 10.4448 73.8402 11.1321V19.1582H70.5615Z" fill="#202020" />
                <path d="M83.1478 19.3931C82.2224 19.3931 81.4027 19.2191 80.6888 18.8711C79.9838 18.5144 79.4329 18.0228 79.0363 17.3964C78.6485 16.7613 78.4546 16.0348 78.4546 15.217V15.1909C78.4546 13.9641 78.9173 12.994 79.8427 12.2806C80.777 11.5585 82.0902 11.1495 83.7824 11.0538L89.1367 10.7276V12.8809L84.2451 13.1811C83.4343 13.2333 82.8129 13.4247 82.3811 13.7553C81.9492 14.0859 81.7333 14.5253 81.7333 15.0734V15.0865C81.7333 15.652 81.9492 16.1001 82.3811 16.4307C82.8217 16.7526 83.4034 16.9135 84.1261 16.9135C84.7607 16.9135 85.3248 16.7874 85.8184 16.5351C86.3207 16.2828 86.7173 15.9391 87.0082 15.5041C87.299 15.0691 87.4445 14.5775 87.4445 14.0294V9.87928C87.4445 9.18325 87.2197 8.63513 86.7702 8.23491C86.3295 7.82599 85.6906 7.62153 84.8533 7.62153C84.0777 7.62153 83.4563 7.78684 82.9892 8.11746C82.5221 8.43937 82.2312 8.85699 82.1166 9.37031L82.0902 9.48777H79.0495L79.0627 9.33116C79.1332 8.51332 79.4109 7.78249 79.8956 7.13866C80.3804 6.48613 81.0502 5.97281 81.9051 5.59869C82.7689 5.22458 83.7912 5.03752 84.9723 5.03752C86.1445 5.03752 87.158 5.22893 88.0129 5.61175C88.8767 5.99456 89.5421 6.52964 90.0092 7.21697C90.4851 7.9043 90.7231 8.71343 90.7231 9.64437V19.1582H87.4445V17.031H87.3651C87.1007 17.5095 86.757 17.9271 86.334 18.2838C85.9109 18.6406 85.4261 18.9146 84.8797 19.106C84.3421 19.2974 83.7648 19.3931 83.1478 19.3931Z" fill="#202020" />
                <path d="M92.8521 19.1582V5.32463H96.1308V7.54323H96.2101C96.501 6.7863 96.9901 6.18162 97.6776 5.7292C98.365 5.26808 99.1715 5.03752 100.097 5.03752C100.749 5.03752 101.335 5.15063 101.855 5.37684C102.375 5.59434 102.816 5.91191 103.177 6.32953C103.547 6.73844 103.816 7.23872 103.984 7.83034H104.05C104.279 7.25612 104.605 6.76455 105.028 6.35563C105.46 5.93801 105.962 5.6161 106.535 5.38989C107.117 5.15498 107.743 5.03752 108.413 5.03752C109.338 5.03752 110.14 5.23328 110.819 5.6248C111.506 6.00761 112.039 6.54704 112.418 7.24307C112.806 7.9304 113 8.73953 113 9.67047V19.1582H109.708V10.4666C109.708 9.61392 109.492 8.95269 109.06 8.48287C108.628 8.01305 108.007 7.77814 107.196 7.77814C106.667 7.77814 106.2 7.89995 105.795 8.14356C105.398 8.37847 105.085 8.70908 104.856 9.1354C104.636 9.56172 104.526 10.0533 104.526 10.6101V19.1582H101.326V10.2969C101.326 9.51387 101.102 8.90049 100.652 8.45677C100.211 8.00435 99.6077 7.77814 98.841 7.77814C98.3121 7.77814 97.845 7.9043 97.4396 8.15661C97.0342 8.40892 96.7125 8.75258 96.4745 9.1876C96.2454 9.62262 96.1308 10.1229 96.1308 10.6884V19.1582H92.8521Z" fill="#202020" />
              </svg>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-smooth"
          >
            <ChevronRight className={`w-4 h-4 transition-smooth ${isCollapsed ? 'rotate-0' : 'rotate-180'
              }`} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {getMenuItems().map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const showBadge = item.label === "Messages" && unreadMessagesCount > 0;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth hover:bg-gray-50 relative"
                >
                  <div className="flex-shrink-0 relative">
                    <Icon isActive={isActive} />
                    {showBadge && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#EC3558] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                      </div>
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span
                        className="text-lg font-medium capitalize tracking-[-0.63px]"
                        style={{
                          fontFamily: '"SF Pro", sans-serif',
                          fontWeight: 590,
                          color: isActive ? '#252525' : '#8A96A3'
                        }}
                      >
                        {item.label}
                      </span>
                      {showBadge && (
                        <div className="w-6 h-6 bg-[#EC3558] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                          {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <Link
          to="/logout"
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth hover:bg-gray-50"
        >
          <div className="flex-shrink-0">
            <LogoutIcon />
          </div>
          {!isCollapsed && (
            <span
              className="flex-1 text-lg font-medium capitalize tracking-[-0.63px]"
              style={{
                fontFamily: '"SF Pro", sans-serif',
                fontWeight: 590,
                color: '#EC3558'
              }}
            >
              Déconnexion
            </span>
          )}
        </Link>

        {!isCollapsed && (
          <Button
            variant="stragram"
            className="w-full mt-3"
            onClick={focusCompose}
          >
            PUBLIER
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;