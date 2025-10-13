import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import forestCover from "@/assets/forest-cover.jpg";
import { useMemo } from "react";
import { useQuickAddBreakpoint } from "@/hooks/use-mobile";

// Données fixes des profils suggérés
const allProfiles = [
  {
    id: 1,
    name: "Tom Berton",
    username: "tomberton",
    coverImage: forestCover,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  },
  {
    id: 2,
    name: "Lucie Marinier",
    username: "luciemarinier10",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
  },
  {
    id: 3,
    name: "Marie Marind",
    username: "mariemaring",
    coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
  },
  {
    id: 4,
    name: "John Doe",
    username: "johndoe",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
    avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400",
  },
  {
    id: 5,
    name: "Anna Smith",
    username: "annasmith",
    coverImage: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=800",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
  }
];

const QuickAdd = () => {
  // Utiliser useMemo pour conserver les mêmes profils entre les rendus
  const profiles = useMemo(() => {
    // Sélectionner toujours les 3 premiers profils pour éviter les changements aléatoires
    return allProfiles.slice(0, 3);
  }, []);

  // Vérifier si l'écran est inférieur à 1000px
  const isBelowBreakpoint = useQuickAddBreakpoint();

  // Ne pas afficher le composant si l'écran est inférieur à 1000px
  if (isBelowBreakpoint) {
    return null;
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-card p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ajout Rapide</h2>

      <div className="space-y-4">
        {profiles.map((profile) => (
          <Link key={profile.id} to={`/u/${profile.username}`} className="block">
            <div className="relative hover:-translate-y-0.5 transition-transform duration-200 cursor-pointer">
              {/* Cover Image */}
              <div className="h-32 rounded-xl overflow-hidden relative">
                <img
                  src={profile.coverImage}
                  alt={`${profile.name} cover`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Profile Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-white">
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                      <AvatarFallback className="bg-stragram-primary text-white text-sm">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-white">
                      <h3 className="font-semibold text-base">{profile.name}</h3>
                      <p className="text-sm text-white/90">@{profile.username}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickAdd;