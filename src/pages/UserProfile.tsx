import { useState } from "react";
import { useParams } from "react-router-dom";
import { Camera, MapPin, Calendar, Link as LinkIcon, Settings } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import QuickAdd from "@/components/QuickAdd";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import sunsetBeach from "@/assets/sunset-beach.jpg";
import forestCover from "@/assets/forest-cover.jpg";

// Data for different users
const userData = {
  "lucashergz20": {
    name: "Lucas Hergz",
    username: "lucashergz20",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    coverImage: sunsetBeach,
    verified: true,
    bio: "Des petits postes tous les jours, n'hésitez pas !",
    stats: { posts: 4, likes: 133, followers: 12, following: 12 },
    joinDate: "mars 2023",
    location: "Paris, France",
    photos: [
      "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=400",
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    ],
    videos: [
      "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=400",
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400",
    ],
  },
  "tomberton": {
    name: "Tom Berton",
    username: "tomberton",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    coverImage: forestCover,
    verified: false,
    bio: "Passionné de nature et de photographie 🌲📸",
    stats: { posts: 8, likes: 245, followers: 89, following: 156 },
    joinDate: "janvier 2024",
    location: "Lyon, France",
    photos: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
    ],
    videos: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    ],
  },
  "luciemarinier10": {
    name: "Lucie Marinier",
    username: "luciemarinier10",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    verified: false,
    bio: "Aventurière dans l'âme ✈️ Toujours prête pour de nouvelles découvertes !",
    stats: { posts: 15, likes: 432, followers: 203, following: 98 },
    joinDate: "septembre 2023",
    location: "Nice, France",
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      "https://images.unsplash.com/photo-1464822759844-d150baec0bc5?w=400",
      "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400",
      "https://images.unsplash.com/photo-1493787039806-2edcbe808750?w=400",
    ],
    videos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      "https://images.unsplash.com/photo-1464822759844-d150baec0bc5?w=400",
    ],
  },
  "mariemaring": {
    name: "Marie Marind",
    username: "mariemaring",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    verified: false,
    bio: "Créatrice de contenu 🎨 | Food & Lifestyle | Partage mes moments du quotidien",
    stats: { posts: 23, likes: 567, followers: 345, following: 189 },
    joinDate: "juin 2023",
    location: "Marseille, France",
    photos: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
    ],
    videos: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
    ],
  },
};

const UserProfile = () => {
  const { username } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);

  const user = userData[username as keyof typeof userData];

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Utilisateur introuvable</h1>
            <p className="text-gray-600">Ce profil n'existe pas ou a été supprimé.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex max-w-none h-full">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Cover Photo */}
            <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
              <img
                src={user.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Profile Picture */}
              <div className="absolute bottom-6 left-6">
                <Avatar className="w-32 h-32 border-4 border-white">
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-stragram-primary text-white text-2xl">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    {user.verified && (
                      <Badge variant="destructive" className="bg-stragram-primary">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">@{user.username}</p>
                  <p className="text-gray-800 mb-4 leading-relaxed">{user.bio}</p>

                  <div className="flex items-center gap-1 text-gray-600 mb-4">
                    <span className="font-semibold text-gray-900">{user.stats.followers}</span>
                    <span>abonnés</span>
                    <span className="mx-2">•</span>
                    <span className="font-semibold text-gray-900">{user.stats.following}</span>
                    <span>abonnements</span>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 h-8 px-3">
                      <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold">
                        T
                      </div>
                      <span className="text-xs">TikTok</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Follow Section */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-3 uppercase tracking-wide font-medium">ABONNEMENT</p>
                {username === "lucashergz20" ? (
                  <Button variant="outline" className="w-full h-12 text-stragram-primary border-stragram-primary hover:bg-stragram-primary hover:text-white rounded-[28.5px]">
                    <Settings className="w-4 h-4 mr-2" />
                    Éditer le profil
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`w-full h-12 font-medium transition-all duration-200 rounded-[28.5px] ${isFollowing
                      ? "bg-[#EC3558] text-white hover:bg-[#EC3558]/90"
                      : "border-2 border-stragram-primary text-stragram-primary bg-transparent hover:bg-stragram-primary hover:text-white"
                      }`}
                  >
                    {isFollowing ? "Désabonner" : "S'abonner"}
                  </Button>
                )}
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-2xl shadow-sm">
              <Tabs defaultValue="photos" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 h-auto border-b border-gray-200">
                  <TabsTrigger
                    value="photos"
                    className="flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-stragram-primary data-[state=active]:text-stragram-primary rounded-none"
                  >
                    {user.photos.length} PHOTOS
                  </TabsTrigger>
                  <TabsTrigger
                    value="videos"
                    className="flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-stragram-primary data-[state=active]:text-stragram-primary rounded-none"
                  >
                    {user.videos.length} VIDÉOS
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="photos" className="p-0 mt-0">
                  <div className="grid grid-cols-3 gap-1">
                    {user.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="videos" className="p-0 mt-0">
                  <div className="grid grid-cols-3 gap-1">
                    {user.videos.map((video, index) => (
                      <div
                        key={index}
                        className="aspect-square overflow-hidden hover:opacity-90 transition-opacity cursor-pointer relative"
                      >
                        <img
                          src={video}
                          alt={`Video ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white">
                            ▶
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
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

export default UserProfile;