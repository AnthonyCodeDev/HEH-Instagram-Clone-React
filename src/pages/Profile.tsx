import { useState } from "react";
import { Camera, MapPin, Calendar, Link as LinkIcon, Settings } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import RightBar from "@/components/RightBar";
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

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex max-w-none h-full overflow-x-hidden">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto w-full">
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
                  <DialogContent className="sm:max-w-[450px] max-h-[85vh] flex flex-col p-0" hideClose>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 pb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Éditer le profil</h2>
                      <button
                        onClick={() => setIsEditModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6 space-y-5 overflow-y-auto flex-1">
                      {/* Profile Picture */}
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" alt={profileData.name} />
                          <AvatarFallback className="bg-stragram-primary text-white text-lg">
                            {profileData.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm" className="text-stragram-primary border-stragram-primary hover:bg-stragram-primary/5">
                          <Camera className="w-4 h-4 mr-2" />
                          Changer
                        </Button>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-4">
                        <div>
                          <Input
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Nom complet"
                            className="h-11 border-gray-200 focus:border-stragram-primary focus:ring-stragram-primary/20"
                          />
                        </div>

                        <div>
                          <Input
                            value={profileData.username}
                            onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                            placeholder="Nom d'utilisateur"
                            className="h-11 border-gray-200 focus:border-stragram-primary focus:ring-stragram-primary/20"
                          />
                        </div>

                        <div>
                          <textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Bio"
                            className="w-full h-20 px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-stragram-primary focus:ring-2 focus:ring-stragram-primary/20 text-sm"
                          />
                        </div>

                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            value={profileData.location}
                            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Localisation"
                            className="h-11 pl-10 border-gray-200 focus:border-stragram-primary focus:ring-stragram-primary/20"
                          />
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Réseaux sociaux</p>

                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                              <svg width="18" height="18" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.217407" y="0.0869141" width="22.8261" height="22.8261" rx="11.413" fill="black" />
                                <path d="M10.296 10.0573V9.51623C10.1157 9.47115 9.93534 9.47119 9.75499 9.47119C7.45547 9.47119 5.60684 11.3198 5.60684 13.6193C5.60684 15.017 6.32826 16.2795 7.36529 17.0009L7.32021 16.9558C6.64388 16.2344 6.28317 15.2425 6.28317 14.2055C6.28317 11.906 8.08671 10.1024 10.296 10.0573Z" fill="#25F4EE" />
                                <path d="M10.3792 16.1046C11.4162 16.1046 12.2278 15.293 12.2729 14.256V5.23825H13.8961C13.851 5.0579 13.851 4.87754 13.851 4.6521H11.5966V13.6698C11.5515 14.6618 10.7399 15.4733 9.70286 15.4733C9.38724 15.4733 9.07162 15.3832 8.84618 15.2479C9.20688 15.7439 9.74795 16.1046 10.3792 16.1046ZM17.0071 8.30427V7.76321C16.3759 7.76321 15.7897 7.58285 15.2937 7.26723C15.7446 7.76321 16.3308 8.16901 17.0071 8.30427Z" fill="#25F4EE" />
                                <path d="M15.2952 7.26206C14.7992 6.721 14.5287 5.99958 14.5287 5.18799H13.8974C14.0778 6.08976 14.6188 6.81118 15.2952 7.26206ZM9.74933 11.6807C8.7123 11.6807 7.85561 12.5374 7.85561 13.5744C7.85561 14.2958 8.3065 14.9271 8.89265 15.2427C8.66721 14.9271 8.53194 14.5664 8.53194 14.1606C8.53194 13.1235 9.38862 12.2668 10.4257 12.2668C10.606 12.2668 10.7864 12.3119 10.9667 12.357V10.0575C10.7864 10.0124 10.606 10.0124 10.4257 10.0124H10.3355V11.7258C10.11 11.7258 9.92969 11.6807 9.74933 11.6807Z" fill="#FE2C55" />
                                <path d="M17.0227 8.29297V10.0063C15.8504 10.0063 14.7683 9.64562 13.9116 9.01439V13.6134C13.9116 15.9129 12.063 17.7616 9.76348 17.7616C8.86171 17.7616 8.05011 17.491 7.37379 17.0401C8.14029 17.8517 9.22242 18.3477 10.3947 18.3477C12.6942 18.3477 14.5429 16.4991 14.5429 14.1996V9.60054C15.4446 10.2318 16.5268 10.5925 17.654 10.5925V8.33806C17.4736 8.33806 17.2482 8.33806 17.0227 8.29297Z" fill="#FE2C55" />
                                <path d="M13.9144 13.6195V9.02051C14.8161 9.6518 15.8983 10.0125 17.0255 10.0125V8.25401C16.3491 8.11874 15.763 7.75803 15.3121 7.26206C14.5907 6.81118 14.0947 6.04467 13.9595 5.18799H12.2912V14.2057C12.2461 15.1977 11.4345 16.0093 10.3975 16.0093C9.76622 16.0093 9.22516 15.6936 8.86445 15.2427C8.2783 14.9722 7.8725 14.341 7.8725 13.6195C7.8725 12.5825 8.72918 11.7259 9.76622 11.7259C9.94657 11.7259 10.1269 11.7709 10.3073 11.816V10.0575C8.05285 10.1026 6.24931 11.9513 6.24931 14.2057C6.24931 15.2879 6.65511 16.2798 7.37653 17.0463C8.05285 17.4972 8.86445 17.8128 9.76622 17.8128C12.0657 17.7677 13.9144 15.874 13.9144 13.6195Z" fill="white" />
                              </svg>
                            </div>
                            <Input
                              value={profileData.socialLinks.tiktok}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                socialLinks: { ...prev.socialLinks, tiktok: e.target.value }
                              }))}
                              placeholder="TikTok"
                              className="h-9 text-sm border-gray-200 focus:border-stragram-primary focus:ring-stragram-primary/20"
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                              <svg width="18" height="18" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.69565" y="0.0869141" width="22.8261" height="22.8261" rx="11.413" fill="white" />
                                <g clipPath="url(#clip0_11_27)">
                                  <g clipPath="url(#clip1_11_27)">
                                    <path d="M19.3993 7.57574C19.2239 6.87383 18.709 6.32224 18.0539 6.13435C16.8676 5.79346 12.1087 5.79346 12.1087 5.79346C12.1087 5.79346 7.34982 5.79346 6.16354 6.13435C5.5084 6.32224 4.99355 6.87383 4.81818 7.57574C4.5 8.84669 4.5 11.5 4.5 11.5C4.5 11.5 4.5 14.1533 4.81818 15.4242C4.99355 16.1261 5.5084 16.6777 6.16354 16.8656C7.34982 17.2065 12.1087 17.2065 12.1087 17.2065C12.1087 17.2065 16.8676 17.2065 18.0539 16.8656C18.709 16.6777 19.2239 16.1261 19.3993 15.4242C19.7174 14.1533 19.7174 11.5 19.7174 11.5C19.7174 11.5 19.7162 8.84669 19.3993 7.57574Z" fill="#FF0000" />
                                    <path d="M10.5855 13.9455L14.5389 11.5002L10.5855 9.05493V13.9455Z" fill="white" />
                                  </g>
                                </g>
                                <defs>
                                  <clipPath id="clip0_11_27">
                                    <rect width="15.2174" height="11.413" fill="white" transform="translate(4.5 5.79346)" />
                                  </clipPath>
                                  <clipPath id="clip1_11_27">
                                    <rect width="15.2174" height="11.413" fill="white" transform="translate(4.5 5.79346)" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <Input
                              value={profileData.socialLinks.youtube}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                              }))}
                              placeholder="YouTube"
                              className="h-9 text-sm border-gray-200 focus:border-stragram-primary focus:ring-stragram-primary/20"
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                              <svg width="18" height="18" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.17392" y="0.0869141" width="22.8261" height="22.8261" rx="11.413" fill="black" />
                                <path d="M14.6768 6.17383H16.3096L12.7246 10.6941L16.9131 16.826H13.6262L11.0528 13.0997L8.10664 16.826H6.47385L10.2719 11.9913L6.26088 6.17383H9.62939L11.9543 9.57781L14.6768 6.17383ZM14.1054 15.7647H15.0105L9.15376 7.19581H8.18118L14.1054 15.7647Z" fill="white" />
                              </svg>
                            </div>
                            <Input
                              value={profileData.socialLinks.twitter}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                              }))}
                              placeholder="Twitter"
                              className="h-9 text-sm border-gray-200 focus:border-stragram-primary focus:ring-stragram-primary/20"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-6 pt-4 border-t border-gray-100">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditModalOpen(false)}
                        className="flex-1 h-11"
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        className="flex-1 h-11 bg-stragram-primary hover:bg-stragram-primary/90"
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
                    <h1
                      className="font-medium capitalize"
                      style={{
                        fontFamily: '"SF Pro", sans-serif',
                        fontSize: '19px',
                        fontWeight: 590,
                        color: '#252525',
                        textAlign: 'center',
                        textTransform: 'capitalize'
                      }}
                    >
                      {profileData.name}
                    </h1>
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
                      {profileData.socialLinks.tiktok}
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <svg width="16" height="15" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.69565" y="0.0869141" width="22.8261" height="22.8261" rx="11.413" fill="white" />
                          <g clipPath="url(#clip0_11_27)">
                            <g clipPath="url(#clip1_11_27)">
                              <path d="M19.3993 7.57574C19.2239 6.87383 18.709 6.32224 18.0539 6.13435C16.8676 5.79346 12.1087 5.79346 12.1087 5.79346C12.1087 5.79346 7.34982 5.79346 6.16354 6.13435C5.5084 6.32224 4.99355 6.87383 4.81818 7.57574C4.5 8.84669 4.5 11.5 4.5 11.5C4.5 11.5 4.5 14.1533 4.81818 15.4242C4.99355 16.1261 5.5084 16.6777 6.16354 16.8656C7.34982 17.2065 12.1087 17.2065 12.1087 17.2065C12.1087 17.2065 16.8676 17.2065 18.0539 16.8656C18.709 16.6777 19.2239 16.1261 19.3993 15.4242C19.7174 14.1533 19.7174 11.5 19.7174 11.5C19.7174 11.5 19.7162 8.84669 19.3993 7.57574Z" fill="#FF0000" />
                              <path d="M10.5855 13.9455L14.5389 11.5002L10.5855 9.05493V13.9455Z" fill="white" />
                            </g>
                          </g>
                          <defs>
                            <clipPath id="clip0_11_27">
                              <rect width="15.2174" height="11.413" fill="white" transform="translate(4.5 5.79346)" />
                            </clipPath>
                            <clipPath id="clip1_11_27">
                              <rect width="15.2174" height="11.413" fill="white" transform="translate(4.5 5.79346)" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      {profileData.socialLinks.youtube}
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <svg width="15" height="15" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.17392" y="0.0869141" width="22.8261" height="22.8261" rx="11.413" fill="black" />
                          <path d="M14.6768 6.17383H16.3096L12.7246 10.6941L16.9131 16.826H13.6262L11.0528 13.0997L8.10664 16.826H6.47385L10.2719 11.9913L6.26088 6.17383H9.62939L11.9543 9.57781L14.6768 6.17383ZM14.1054 15.7647H15.0105L9.15376 7.19581H8.18118L14.1054 15.7647Z" fill="white" />
                        </svg>
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
                      <a
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-smooth cursor-pointer"
                        href={`/profile/${index + 1}`}
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState({
                            state: { image: photo, user: { name: profileData.name, username: profileData.username, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" } }
                          }, '', `/profile/${index + 1}`);
                          window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                      >
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
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
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <RightBar />
      </div>
    </div>
  );
};

export default Profile;