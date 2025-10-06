import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  "bahsonnom": {
    name: "Bahson Nom",
    username: "bahsonnom",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    coverImage: sunsetBeach,
    bio: "Mon compte personnel sur Stragram. Je partage mes créations et mes passions !",
    stats: { posts: 27, likes: 512, followers: 183, following: 94 },
    joinDate: "janvier 2023",
    location: "Paris, France",
    photos: [
      "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=400",
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    ],
    videos: [
      "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=400",
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    ],
  },
  "lucashergz20": {
    name: "Lucas Hergz",
    username: "lucashergz20",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    coverImage: sunsetBeach,
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const user = userData[username as keyof typeof userData];

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1
              className="font-medium capitalize mb-2"
              style={{
                fontFamily: '"SF Pro", sans-serif',
                fontSize: '19px',
                fontWeight: 590,
                color: '#252525',
                textAlign: 'center',
                textTransform: 'capitalize'
              }}
            >
              Utilisateur introuvable
            </h1>
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
            <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
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

              {/* Edit Profile Button pour bahsonnom */}
              {username === "bahsonnom" && (
                <div className="absolute bottom-6 right-6">
                  <Button
                    variant="outline"
                    className="bg-white text-stragram-primary border-stragram-primary hover:bg-stragram-primary hover:text-white rounded-full h-10 px-4"
                    asChild
                  >
                    <Link to="/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Éditer le profil
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
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
                      <div className="w-4 h-4 flex items-center justify-center">
                        <svg width="16" height="15" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.217407" y="0.0869141" width="22.8261" height="22.8261" rx="11.413" fill="black" />
                          <path d="M10.296 10.0573V9.51623C10.1157 9.47115 9.93534 9.47119 9.75499 9.47119C7.45547 9.47119 5.60684 11.3198 5.60684 13.6193C5.60684 15.017 6.32826 16.2795 7.36529 17.0009L7.32021 16.9558C6.64388 16.2344 6.28317 15.2425 6.28317 14.2055C6.28317 11.906 8.08671 10.1024 10.296 10.0573Z" fill="#25F4EE" />
                          <path d="M10.3792 16.1046C11.4162 16.1046 12.2278 15.293 12.2729 14.256V5.23825H13.8961C13.851 5.0579 13.851 4.87754 13.851 4.6521H11.5966V13.6698C11.5515 14.6618 10.7399 15.4733 9.70286 15.4733C9.38724 15.4733 9.07162 15.3832 8.84618 15.2479C9.20688 15.7439 9.74795 16.1046 10.3792 16.1046ZM17.0071 8.30427V7.76321C16.3759 7.76321 15.7897 7.58285 15.2937 7.26723C15.7446 7.76321 16.3308 8.16901 17.0071 8.30427Z" fill="#25F4EE" />
                          <path d="M15.2952 7.26206C14.7992 6.721 14.5287 5.99958 14.5287 5.18799H13.8974C14.0778 6.08976 14.6188 6.81118 15.2952 7.26206ZM9.74933 11.6807C8.7123 11.6807 7.85561 12.5374 7.85561 13.5744C7.85561 14.2958 8.3065 14.9271 8.89265 15.2427C8.66721 14.9271 8.53194 14.5664 8.53194 14.1606C8.53194 13.1235 9.38862 12.2668 10.4257 12.2668C10.606 12.2668 10.7864 12.3119 10.9667 12.357V10.0575C10.7864 10.0124 10.606 10.0124 10.4257 10.0124H10.3355V11.7258C10.11 11.7258 9.92969 11.6807 9.74933 11.6807Z" fill="#FE2C55" />
                          <path d="M17.0227 8.29297V10.0063C15.8504 10.0063 14.7683 9.64562 13.9116 9.01439V13.6134C13.9116 15.9129 12.063 17.7616 9.76348 17.7616C8.86171 17.7616 8.05011 17.491 7.37379 17.0401C8.14029 17.8517 9.22242 18.3477 10.3947 18.3477C12.6942 18.3477 14.5429 16.4991 14.5429 14.1996V9.60054C15.4446 10.2318 16.5268 10.5925 17.654 10.5925V8.33806C17.4736 8.33806 17.2482 8.33806 17.0227 8.29297Z" fill="#FE2C55" />
                          <path d="M13.9144 13.6195V9.02051C14.8161 9.6518 15.8983 10.0125 17.0255 10.0125V8.25401C16.3491 8.11874 15.763 7.75803 15.3121 7.26206C14.5907 6.81118 14.0947 6.04467 13.9595 5.18799H12.2912V14.2057C12.2461 15.1977 11.4345 16.0093 10.3975 16.0093C9.76622 16.0093 9.22516 15.6936 8.86445 15.2427C8.2783 14.9722 7.8725 14.341 7.8725 13.6195C7.8725 12.5825 8.72918 11.7259 9.76622 11.7259C9.94657 11.7259 10.1269 11.7709 10.3073 11.816V10.0575C8.05285 10.1026 6.24931 11.9513 6.24931 14.2057C6.24931 15.2879 6.65511 16.2798 7.37653 17.0463C8.05285 17.4972 8.86445 17.8128 9.76622 17.8128C12.0657 17.7677 13.9144 15.874 13.9144 13.6195Z" fill="white" />
                        </svg>
                      </div>
                      <span className="text-xs">TikTok</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Follow Section - uniquement pour les autres utilisateurs, pas pour bahsonnom */}
              {username !== "bahsonnom" && (
                <div className="border-t pt-4">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`relative w-full h-[57px] rounded-[28.5px] transition-all duration-200 ${!isFollowing
                      ? "bg-[#EC3558]"
                      : "bg-white border-2 border-[#EC3558]"
                      }`}
                  >
                    <span
                      className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-base leading-5 tracking-[-0.035em] uppercase flex items-center text-center ${!isFollowing
                        ? "text-white"
                        : "text-[#EC3558]"
                        }`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {isFollowing ? "Abonné" : "S'abonner"}
                    </span>
                  </button>
                </div>
              )}
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
                      <Link
                        key={index}
                        to={`/u/${username}/${username}-photo-${index}`}
                        className="aspect-square overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="videos" className="p-0 mt-0">
                  <div className="grid grid-cols-3 gap-1">
                    {user.videos.map((video, index) => (
                      <Link
                        key={index}
                        to={`/u/${username}/${username}-video-${index}`}
                        className="aspect-square overflow-hidden hover:opacity-90 transition-opacity cursor-pointer relative"
                      >
                        <img
                          src={video}
                          alt={`Video ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 2L13 8L3 14V2Z"
                                fill="white"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
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