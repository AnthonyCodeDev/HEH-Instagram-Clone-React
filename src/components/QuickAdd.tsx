import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useQuickAddBreakpoint } from "@/hooks/use-mobile";
import { userService } from "@/services/userService";
import type { UserResponse } from "@/types/user";
import { Loader2 } from "lucide-react";

// Image par défaut si aucune image de couverture n'est fournie
const DEFAULT_COVER = "/src/assets/default-background.png";

const QuickAdd = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [profiles, setProfiles] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Nombre de profils à afficher par page
  const profilesPerPage = 3;

  // Charger les profils aléatoires depuis l'API
  useEffect(() => {
    const loadRandomUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const randomUsers = await userService.getRandomUsers(9); // On charge 9 profils pour avoir 3 pages
        setProfiles(randomUsers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
        console.error("Erreur lors du chargement des profils aléatoires:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRandomUsers();
  }, []);

  // Log pour le débogage
  console.log('Profiles received:', profiles);

  // S'assurer que profiles est un tableau
  const profilesArray = Array.isArray(profiles) ? profiles : [];

  // Calculer les profils à afficher pour la page actuelle
  const displayedProfiles = profilesArray.slice(
    activeTab * profilesPerPage,
    (activeTab + 1) * profilesPerPage
  );

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(profilesArray.length / profilesPerPage);

  // Vérifier si l'écran est inférieur à 1000px
  const isBelowBreakpoint = useQuickAddBreakpoint();

  // Ne pas afficher le composant si l'écran est inférieur à 1000px
  if (isBelowBreakpoint) {
    return null;
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Ajout Rapide</h2>

        {/* Tabs discrets avec zone cliquable plus large et rapprochés */}
        <div className="flex items-center">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className="w-6 h-6 flex items-center justify-center cursor-pointer"
              aria-label={`Page ${index + 1}`}
            >
              <span className={`rounded-full transition-all duration-300 h-2 ${activeTab === index
                ? 'bg-stragram-primary w-4'
                : 'bg-gray-300 hover:bg-gray-400 w-2'
                }`} />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-stragram-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : displayedProfiles.length === 0 ? (
          <div className="text-center text-gray-500 p-4">Aucun profil à suggérer</div>
        ) : (
          displayedProfiles.map((profile) => (
            <Link key={profile.id} to={`/u/${profile.username}`} className="block">
              <div className="relative cursor-pointer">
                {/* Cover Image */}
                <div className="h-32 rounded-xl overflow-hidden relative">
                  <img
                    src={profile.bannerUrl || DEFAULT_COVER}
                    alt={`${profile.name || profile.username} cover`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Profile Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={profile.avatarUrl || undefined}
                          alt={profile.name || profile.username}
                        />
                        <AvatarFallback>
                          <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground">
                            {(profile.name || profile.username).charAt(0).toLowerCase()}
                          </span>
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-white">
                        <h3 className="font-semibold text-base">
                          {profile.name || profile.username}
                        </h3>
                        <p className="text-sm text-white/90">@{profile.username}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default QuickAdd;