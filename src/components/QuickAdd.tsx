import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import forestCover from "@/assets/forest-cover.jpg";

const profiles = [
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
];

const QuickAdd = () => {
  return (
    <div className="w-80 bg-white rounded-2xl shadow-card p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ajout Rapide</h2>
      
      <div className="space-y-4">
        {profiles.map((profile) => (
          <Link key={profile.id} to={`/user/${profile.username}`} className="block">
            <div className="relative hover:scale-105 transition-smooth cursor-pointer">
              {/* Cover Image */}
            <div className="h-24 rounded-xl overflow-hidden relative">
              <img 
                src={profile.coverImage} 
                alt={`${profile.name} cover`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Profile Info */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div className="text-white">
                  <h3 className="font-semibold text-sm">{profile.name}</h3>
                  <p className="text-xs text-white/80">@{profile.username}</p>
                </div>
                
                <Avatar className="w-10 h-10 border-2 border-white">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="bg-stragram-primary text-white text-xs">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            {/* Follow Button */}
            <Button 
              variant="stragram" 
              size="sm" 
              className="absolute -bottom-2 right-3 h-8 px-4 text-xs z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Suivre
            </Button>
          </div>
        </Link>
        ))}
      </div>
      
      {/* Search Bar */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher dans Stragram"
            className="w-full h-10 pl-4 pr-4 bg-gray-50 border-0 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-stragram-primary/20"
          />
        </div>
      </div>
    </div>
  );
};

export default QuickAdd;