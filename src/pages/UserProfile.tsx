import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Settings } from "lucide-react";
import defaultBackground from "@/assets/default-background.png";
import Sidebar from "@/components/Sidebar";
import RightBar from "@/components/RightBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userService } from "@/services/userService";
import type { UserResponse, PostResponse } from "@/types/user";

interface UserProfileState {
  user: UserResponse | null;
  posts: PostResponse[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

const UserProfile = () => {
  const { username } = useParams();
  const [state, setState] = useState<UserProfileState>({
    user: null,
    posts: [],
    loading: true,
    error: null,
    page: 0,
    hasMore: true
  });
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);

  // Charger l'utilisateur courant
  useEffect(() => {
    const loadCurrentUser = async () => {
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
    };
    loadCurrentUser();
  }, []);

  // Fonction pour gérer le follow/unfollow
  const handleFollowToggle = async () => {
    if (!state.user) return;

    try {
      if (state.user.isCurrentUserFollowing) {
        await userService.unfollowUser(state.user.id);
      } else {
        await userService.followUser(state.user.id);
      }

      setState(prev => ({
        ...prev,
        user: prev.user ? {
          ...prev.user,
          isCurrentUserFollowing: !prev.user.isCurrentUserFollowing,
          followersCount: prev.user.isCurrentUserFollowing
            ? prev.user.followersCount - 1
            : prev.user.followersCount + 1
        } : null
      }));
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  // Charger les données de l'utilisateur et ses posts
  useEffect(() => {
    const loadUser = async () => {
      if (!username) return;

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const userData = await userService.getUserByUsername(username);
        const postsData = await userService.getUserPosts(userData.id);

        setState(prev => ({
          ...prev,
          user: userData,
          posts: postsData.posts,
          page: postsData.page,
          hasMore: postsData.hasMore,
          loading: false
        }));
      } catch (error) {
        console.error('Error in loadUser:', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Erreur lors du chargement du profil',
          loading: false
        }));
      }
    };

    loadUser();
  }, [username]);

  // Charger plus de posts
  const loadMorePosts = async () => {
    if (!state.user || !state.hasMore || state.loading) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      const nextPage = state.page + 1;
      const postsData = await userService.getUserPosts(state.user.id, nextPage);

      setState(prev => ({
        ...prev,
        posts: [...prev.posts, ...postsData.posts],
        page: postsData.page,
        hasMore: postsData.hasMore,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erreur lors du chargement des posts'
      }));
    }
  };

  if (state.loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (state.error || !state.user) {
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
              {state.error || "Utilisateur introuvable"}
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

      <div className="flex-1 flex max-w-none h-full overflow-x-hidden">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto w-full">
          <div className="max-w-4xl mx-auto">
            {/* Cover Photo */}
            <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
              <img
                src={state.user.avatarUrl || defaultBackground}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Profile Picture */}
              <div className="absolute bottom-4 left-6">
                <Avatar className="w-24 h-24 border-4 border-white">
                  <AvatarImage
                    src={state.user.avatarUrl}
                    alt={state.user.username}
                  />
                  <AvatarFallback className="bg-stragram-primary text-white text-2xl">
                    {state.user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              {/* Bouton Éditer le profil ou Envoyer un message */}
              <div className="absolute bottom-4 right-6">
                {currentUser && currentUser.username === username ? (
                  <Button
                    variant="outline"
                    className="bg-white text-stragram-primary border-stragram-primary hover:bg-stragram-primary hover:text-white rounded-full h-8 px-4"
                    asChild
                  >
                    <Link to="/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Éditer le profil
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-lg h-9 px-4 font-medium text-sm shadow-sm transition-all duration-200 flex items-center gap-2 hover:border-gray-300"
                    asChild
                  >
                    <Link to={`/messages?u=${username}`} className="flex items-center gap-2">
                      <span className="font-medium">Envoyer un message</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-gray-900">{state.user.username}</h2>
                  </div>
                  <p className="text-gray-600 mb-4">@{state.user.username}</p>
                  <p className="text-gray-800 mb-4 leading-relaxed">{state.user.bio}</p>

                  <div className="flex items-center gap-1 text-gray-600 mb-4">
                    <span className="font-semibold text-gray-900">{state.user.followersCount}</span>
                    <span>abonnés</span>
                    <span className="mx-2">•</span>
                    <span className="font-semibold text-gray-900">{state.user.followingCount}</span>
                    <span>abonnements</span>
                  </div>

                  {/* Social Links */}
                  {state.user.socialLinks && Object.keys(state.user.socialLinks).length > 0 && (
                    <div className="flex items-center gap-2">
                      {state.user.socialLinks.tiktok && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 h-8 px-3"
                          asChild
                        >
                          <a
                            href={state.user.socialLinks.tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
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
                          </a>
                        </Button>
                      )}
                      {state.user.socialLinks.instagram && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 h-8 px-3"
                          asChild
                        >
                          <a
                            href={state.user.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <div className="w-4 h-4 flex items-center justify-center">
                              <svg viewBox="0 0 24 24" width="16" height="15" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                              </svg>
                            </div>
                            <span className="text-xs">Instagram</span>
                          </a>
                        </Button>
                      )}
                      {state.user.socialLinks.twitter && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 h-8 px-3"
                          asChild
                        >
                          <a
                            href={state.user.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <div className="w-4 h-4 flex items-center justify-center">
                              <svg viewBox="0 0 24 24" width="16" height="15" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                              </svg>
                            </div>
                            <span className="text-xs">Twitter</span>
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Follow Section - uniquement pour les autres utilisateurs, pas pour bahsonnom */}
              {username !== state.user.username && (
                <div className="border-t pt-4">
                  <button
                    onClick={handleFollowToggle}
                    className={`relative w-full h-[57px] rounded-[28.5px] transition-all duration-200 ${!state.user.isCurrentUserFollowing
                      ? "bg-[#EC3558]"
                      : "bg-white border-2 border-[#EC3558]"
                      }`}
                  >
                    <span
                      className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-base leading-5 tracking-[-0.035em] uppercase flex items-center text-center ${!state.user.isCurrentUserFollowing
                        ? "text-white"
                        : "text-[#EC3558]"
                        }`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {state.user.isCurrentUserFollowing ? "Abonné" : "S'abonner"}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-2xl shadow-sm">
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 h-auto border-b border-gray-200">
                  <TabsTrigger
                    value="posts"
                    className="flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-stragram-primary data-[state=active]:text-stragram-primary rounded-none"
                  >
                    {state.posts.length} PUBLICATIONS
                  </TabsTrigger>
                  <TabsTrigger
                    value="videos"
                    className="flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-stragram-primary data-[state=active]:text-stragram-primary rounded-none"
                  >
                    0 VIDEOS
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="p-0 mt-0">
                  <div className="grid grid-cols-3 gap-1">
                    {state.posts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/p/${post.id}`}
                        className="aspect-square overflow-hidden hover:opacity-90 transition-opacity cursor-pointer relative"
                      >
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            alt={post.description}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center p-4">
                            <p className="text-sm text-gray-600 line-clamp-4 text-center">
                              {post.description || "Aucune description"}
                            </p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <div className="flex items-center gap-2 text-white">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5"
                            >
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span>{post.likeCount}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5"
                            >
                              <path d="M21 15a2 2 0 0 1-2 2h-2v3.17c0 .53-.61.83-1.03.5L11.83 17H8c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h11c1.1 0 2 .9 2 2v8zM3 6v8c0 1.1.9 2 2 2h2v-9c0-.55.45-1 1-1h9V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2z" />
                            </svg>
                            <span>{post.commentCount}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {state.hasMore && (
                    <div className="text-center py-4">
                      <Button variant="outline" onClick={loadMorePosts} disabled={state.loading}>
                        {state.loading ? "Chargement..." : "Charger plus"}
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="videos" className="p-0 mt-0">
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    Aucune vidéo
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        <RightBar />
      </div>
    </div>
  );
};

export default UserProfile;