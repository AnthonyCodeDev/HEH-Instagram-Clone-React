import { useState } from "react";
import { Camera, MapPin, Calendar, Link as LinkIcon, Settings } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import QuickAdd from "@/components/QuickAdd";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import sunsetBeach from "@/assets/sunset-beach.jpg";

const Profile = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: "Lucas Hergz",
    username: "lucashergz20",
    location: "Paris, France",
    bio: "Des petits postes tous les jours, n'hésitez pas !",
    socialLinks: {
      tiktok: "@lucashergz20",
      youtube: "Lucas Hergz",
      twitter: "@lucashergz20"
    }
  });

  const handleSaveProfile = () => {
    // Here you would typically save to a backend
    setIsEditModalOpen(false);
  };

  const photos = [
    "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=400",
    "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400",
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  ];

  const videos = [
    "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=400",
    "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400",
  ];

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
                src={sunsetBeach}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Profile Picture */}
              <div className="absolute bottom-6 left-6">
                <Avatar className="w-32 h-32 border-4 border-white">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                    alt="Lucas Hergz"
                  />
                  <AvatarFallback className="bg-stragram-primary text-white text-2xl">
                    LH
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              {/* Edit Profile Button */}
              <div className="absolute bottom-6 right-6">
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                      <Settings className="w-4 h-4 mr-2" />
                      Éditer le profil
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
                    <DialogHeader className="flex-shrink-0">
                      <DialogTitle className="text-xl font-bold">Éditer le profil</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4 overflow-y-auto flex-1 pr-2">
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Nom complet
                        </Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className="h-12 rounded-xl"
                        />
                      </div>

                      {/* Username */}
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-medium">
                          Nom d'utilisateur
                        </Label>
                        <Input
                          id="username"
                          value={profileData.username}
                          onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                          className="h-12 rounded-xl"
                          placeholder="@"
                        />
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium">
                          Localisation
                        </Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                          className="h-12 rounded-xl"
                          placeholder="Ville, Pays"
                        />
                      </div>

                      {/* Bio */}
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-sm font-medium">
                          Bio
                        </Label>
                        <textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          className="w-full h-20 px-4 py-3 rounded-xl border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-stragram-primary/20"
                          placeholder="Parlez de vous..."
                        />
                      </div>

                      {/* Social Links */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Réseaux sociaux</Label>

                        <div className="space-y-3">
                          {/* TikTok */}
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-bold">T</span>
                            </div>
                            <Input
                              value={profileData.socialLinks.tiktok}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                socialLinks: { ...prev.socialLinks, tiktok: e.target.value }
                              }))}
                              placeholder="@votre_tiktok"
                              className="h-10 rounded-lg"
                            />
                          </div>

                          {/* YouTube */}
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs">▶</span>
                            </div>
                            <Input
                              value={profileData.socialLinks.youtube}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                              }))}
                              placeholder="Nom de votre chaîne"
                              className="h-10 rounded-lg"
                            />
                          </div>

                          {/* Twitter/X */}
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-bold">X</span>
                            </div>
                            <Input
                              value={profileData.socialLinks.twitter}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                              }))}
                              placeholder="@votre_twitter"
                              className="h-10 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200 flex-shrink-0">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditModalOpen(false)}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                      <Button
                        variant="stragram"
                        onClick={handleSaveProfile}
                        className="flex-1"
                      >
                        Enregistrer
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Profile Info */}
            <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                    <Badge variant="destructive" className="bg-stragram-primary">
                      ✓
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">@{profileData.username}</p>
                  <p className="text-gray-700 mb-4">{profileData.bio}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Rejoint en mars 2023</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm font-medium mb-4">
                    <span><strong>4 posts</strong></span>
                    <span><strong>133 likes</strong></span>
                    <span><strong>12 abonnés</strong> • <strong>12 abonnements</strong></span>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center text-white text-xs">
                        T
                      </div>
                      {profileData.socialLinks.tiktok}
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 text-red-600 border-red-200">
                      <div className="w-4 h-4 bg-red-600 rounded-sm flex items-center justify-center text-white text-xs">
                        ▶
                      </div>
                      {profileData.socialLinks.youtube}
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center text-white text-xs">
                        X
                      </div>
                      {profileData.socialLinks.twitter}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <Tabs defaultValue="photos" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="photos" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    5 PHOTOS
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    6 VIDÉOS
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="photos">
                  <div className="grid grid-cols-3 gap-2">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-smooth cursor-pointer"
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

                <TabsContent value="videos">
                  <div className="grid grid-cols-3 gap-2">
                    {videos.map((video, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-smooth cursor-pointer relative"
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

export default Profile;