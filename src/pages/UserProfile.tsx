import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import defaultBackground from "@/assets/default-background.png";
import Sidebar from "@/components/Sidebar";
import RightBar from "@/components/RightBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userService } from "@/services/userService";
import { bookmarkService } from "@/services/bookmarkService";
import { likesService } from "@/services/likesService";
import FollowersFollowingDialog from "@/components/FollowersFollowingDialog";
import type { UserResponse, PostResponse } from "@/types/user";

interface UserProfileState {
  user: UserResponse | null;
  posts: PostResponse[];
  bookmarkedPosts: PostResponse[];  // ✅ Posts bookmarkés
  likedPosts: PostResponse[];        // ✅ NOUVEAU: Posts likés (favorites)
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  bookmarksPage: number;             // ✅ Page pour les bookmarks
  hasMoreBookmarks: boolean;         // ✅ Plus de bookmarks disponibles
  totalBookmarks: number;            // ✅ Total des bookmarks
  likesPage: number;                 // ✅ NOUVEAU: Page pour les likes
  hasMoreLikes: boolean;             // ✅ NOUVEAU: Plus de likes disponibles
  totalLikes: number;                // ✅ NOUVEAU: Total des likes
}

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("posts");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInitialTab, setDialogInitialTab] = useState<"followers" | "following">("followers");
  const [state, setState] = useState<UserProfileState>({
    user: null,
    posts: [],
    bookmarkedPosts: [],  // ✅ Posts bookmarkés
    likedPosts: [],       // ✅ NOUVEAU: Posts likés
    loading: true,
    error: null,
    page: 0,
    hasMore: true,
    bookmarksPage: 0,     // ✅ Bookmarks
    hasMoreBookmarks: true,
    totalBookmarks: 0,
    likesPage: 0,         // ✅ NOUVEAU: Likes
    hasMoreLikes: true,
    totalLikes: 0
  });
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);

  // Variable pour savoir si on est sur son propre profil (défini tôt pour être utilisé partout)
  const isOwnProfile = currentUser && currentUser.username === username;

  // Vérifier l'authentification
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

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

        // ✅ Si c'est notre propre profil, précharger TOUTES les données
        let bookmarksCount = 0;
        let likesCount = 0;
        let bookmarkedPostsData: any[] = [];
        let likedPostsData: any[] = [];
        
        if (currentUser && userData.id === currentUser.id) {
          console.log('[UserProfile] 🔄 Loading ALL data for own profile (posts, bookmarks, likes)');
          
          // Charger tout en parallèle pour optimiser le temps de chargement
          const [bookmarksResult, likesResult, bookmarksCountResult, likesCountResult] = await Promise.all([
            bookmarkService.getBookmarkedPosts(0, 12).catch(err => {
              console.error('[UserProfile] Error loading bookmarks:', err);
              return { posts: [], hasMore: false };
            }),
            likesService.getLikedPosts(0, 12).catch(err => {
              console.error('[UserProfile] Error loading likes:', err);
              return { posts: [], hasMore: false };
            }),
            bookmarkService.getBookmarksCount().catch(() => 0),
            likesService.getLikesCount().catch(() => 0)
          ]);
          
          bookmarkedPostsData = bookmarksResult.posts;
          likedPostsData = likesResult.posts;
          bookmarksCount = bookmarksCountResult;
          likesCount = likesCountResult;
          
          console.log('[UserProfile] ✅ Preloaded data:');
          console.log('  - Posts:', postsData.posts.length);
          console.log('  - Bookmarks:', bookmarkedPostsData.length, '(total:', bookmarksCount + ')');
          console.log('  - Likes:', likedPostsData.length, '(total:', likesCount + ')');
        } else {
          console.log('[UserProfile] Not own profile, currentUser:', currentUser?.username, 'userData:', userData.username);
        }

        setState(prev => ({
          ...prev,
          user: userData,
          posts: postsData.posts,
          page: postsData.page,
          hasMore: postsData.hasMore,
          bookmarkedPosts: bookmarkedPostsData, // ✅ Précharger
          likedPosts: likedPostsData, // ✅ Précharger
          totalBookmarks: bookmarksCount,
          totalLikes: likesCount,
          hasMoreBookmarks: bookmarkedPostsData.length >= 12, // S'il y a 12 posts, il y en a peut-être plus
          hasMoreLikes: likedPostsData.length >= 12,
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
  }, [username, currentUser]); // ✅ Ajouter currentUser dans les dépendances

  // ✅ NOUVEAU: Recharger le compteur de bookmarks quand on revient sur la page
  useEffect(() => {
    const reloadBookmarksCount = async () => {
      if (isOwnProfile) {
        const count = await bookmarkService.getBookmarksCount();
        console.log('[UserProfile] Reloaded bookmarks count:', count);
        setState(prev => ({ ...prev, totalBookmarks: count }));
      }
    };

    // Recharger au focus de la fenêtre
    const handleFocus = () => {
      reloadBookmarksCount();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [isOwnProfile]);

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

  // ✅ NOUVEAU: Charger les posts bookmarkés (uniquement pour son propre profil)
  const loadBookmarkedPosts = async () => {
    if (!isOwnProfile) {
      console.log('[UserProfile] Not own profile, skipping bookmarks load');
      return;  // Seulement sur son propre profil
    }

    console.log('[UserProfile] Loading bookmarked posts...');
    setState(prev => ({ ...prev, loading: true }));

    try {
      const bookmarksData = await bookmarkService.getBookmarkedPosts(0, 12);
      console.log('[UserProfile] Bookmarked posts loaded:', bookmarksData);

      setState(prev => ({
        ...prev,
        bookmarkedPosts: bookmarksData.posts,
        bookmarksPage: bookmarksData.page,
        hasMoreBookmarks: bookmarksData.hasMore,
        totalBookmarks: bookmarksData.totalBookmarks || 0,
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('[UserProfile] Error loading bookmarks:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        bookmarkedPosts: [],
        totalBookmarks: 0,
        error: null // Ne pas afficher d'erreur, juste liste vide
      }));
    }
  };

  // ✅ NOUVEAU: Charger plus de bookmarks
  const loadMoreBookmarks = async () => {
    if (!state.hasMoreBookmarks || state.loading) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      const nextPage = state.bookmarksPage + 1;
      const bookmarksData = await bookmarkService.getBookmarkedPosts(nextPage, 12);

      setState(prev => ({
        ...prev,
        bookmarkedPosts: [...prev.bookmarkedPosts, ...bookmarksData.posts],
        bookmarksPage: bookmarksData.page,
        hasMoreBookmarks: bookmarksData.hasMore,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erreur lors du chargement des enregistrements'
      }));
    }
  };

  // ✅ NOUVEAU: Charger les posts likés (favorites) - uniquement pour son propre profil
  const loadLikedPosts = async () => {
    if (!isOwnProfile) {
      console.log('[UserProfile] Not own profile, skipping likes load');
      return;
    }

    console.log('[UserProfile] Loading liked posts...');
    setState(prev => ({ ...prev, loading: true }));

    try {
      const likesData = await likesService.getLikedPosts(0, 12);
      console.log('[UserProfile] Liked posts loaded:', likesData);

      setState(prev => ({
        ...prev,
        likedPosts: likesData.posts,
        likesPage: likesData.page,
        hasMoreLikes: likesData.hasMore,
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('[UserProfile] Error loading likes:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        likedPosts: [],
        error: null
      }));
    }
  };

  // ✅ NOUVEAU: Charger plus de posts likés
  const loadMoreLikes = async () => {
    if (!state.hasMoreLikes || state.loading) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      const nextPage = state.likesPage + 1;
      const likesData = await likesService.getLikedPosts(nextPage, 12);

      setState(prev => ({
        ...prev,
        likedPosts: [...prev.likedPosts, ...likesData.posts],
        likesPage: likesData.page,
        hasMoreLikes: likesData.hasMore,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erreur lors du chargement des likes'
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
                src={state.user.bannerUrl || defaultBackground}
                alt="Cover"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback vers l'image par défaut si l'URL ne fonctionne pas
                  e.currentTarget.src = defaultBackground;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Profile Picture */}
              <div className="absolute bottom-4 left-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={state.user.avatarUrl}
                    alt={state.user.username}
                  />
                  <AvatarFallback className="text-muted-foreground bg-muted">
                    {state.user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {/* connection badge removed per request */}
              </div>

              {/* Bouton Éditer le profil ou Envoyer un message */}
              <div className="absolute bottom-4 right-6">
                {currentUser && currentUser.username === username ? (
                  <Button
                    variant="default"
                    className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-lg h-9 px-4 font-medium text-sm shadow-sm transition-all duration-200 flex items-center gap-2 hover:border-gray-300"
                    asChild
                  >
                    <Link to="/settings" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      <span className="font-medium">Éditer le profil</span>
                    </Link>
                  </Button>
                ) : (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="default"
                      onClick={handleFollowToggle}
                      className={`h-9 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${state.user?.isCurrentUserFollowing ? 'bg-white text-[#EC3558] border border-[#EC3558] hover:bg-[#EC3558] hover:text-white' : 'bg-[#EC3558] text-white hover:bg-[#d43a53]'}`}
                    >
                      {state.user?.isCurrentUserFollowing ? 'Abonné' : "S'abonner"}
                    </Button>

                    <Button
                      variant="default"
                      className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-lg h-9 px-4 font-medium text-sm shadow-sm transition-all duration-200 flex items-center gap-2 hover:border-gray-300"
                      asChild
                    >
                      <Link to={`/messages?u=${username}`} className="flex items-center gap-2">
                        <span className="font-medium">Envoyer un message</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-gray-900">{state.user.name}</h2>
                  </div>
                  <p className="text-gray-600 mb-4">@{state.user.username}</p>
                  <p className="text-gray-800 mb-4 leading-relaxed">{state.user.bio}</p>

                  <div className="flex items-center gap-1 text-gray-600 mb-4">
                    <button
                      onClick={() => {
                        setDialogInitialTab("followers");
                        setDialogOpen(true);
                      }}
                      className="hover:underline cursor-pointer"
                    >
                      <span className="font-semibold text-gray-900">{state.user.followersCount}</span>
                      <span> abonnés</span>
                    </button>
                    <span className="mx-2">•</span>
                    <button
                      onClick={() => {
                        setDialogInitialTab("following");
                        setDialogOpen(true);
                      }}
                      className="hover:underline cursor-pointer"
                    >
                      <span className="font-semibold text-gray-900">{state.user.followingCount}</span>
                      <span> abonnements</span>
                    </button>
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
                      {state.user.socialLinks.youtube && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 h-8 px-3"
                          asChild
                        >
                          <a
                            href={state.user.socialLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
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
                            <span className="text-xs">YouTube</span>
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
              <Tabs 
                value={activeTab}
                onValueChange={async (value) => {
                  console.log('[UserProfile] Tab changing to:', value);
                  setActiveTab(value);
                  
                  // ✅ Optionnel: Recharger les compteurs pour avoir les chiffres à jour
                  // (au cas où ils ont changé depuis le chargement initial)
                  if (isOwnProfile) {
                    const [bookmarksCount, likesCount] = await Promise.all([
                      bookmarkService.getBookmarksCount(),
                      likesService.getLikesCount()
                    ]);
                    console.log('[UserProfile] Counts refreshed - bookmarks:', bookmarksCount, 'likes:', likesCount);
                    setState(prev => ({ 
                      ...prev, 
                      totalBookmarks: bookmarksCount,
                      totalLikes: likesCount
                    }));
                  }
                  
                  // ℹ️ Les données sont déjà préchargées au chargement initial
                  // Pas besoin de charger ici, sauf si tu veux forcer un refresh
                }}
                className="w-full"
              >
                <TabsList className={`grid w-full ${isOwnProfile ? 'grid-cols-3' : 'grid-cols-1'} bg-transparent p-0 h-auto border-b border-gray-200`}>
                  <TabsTrigger
                    value="posts"
                    className="flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-stragram-primary data-[state=active]:text-stragram-primary rounded-none"
                  >
                    PUBLICATIONS ({state.posts.length})
                  </TabsTrigger>
                  
                  {/* ✅ NOUVEAU: Onglet Likes/Favorites (visible uniquement sur son propre profil) */}
                  {isOwnProfile && (
                    <TabsTrigger
                      value="likes"
                      className="flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-stragram-primary data-[state=active]:text-stragram-primary rounded-none"
                    >
                      LIKES ({state.totalLikes})
                    </TabsTrigger>
                  )}
                  
                  {/* ✅ Onglet Enregistrements (visible uniquement sur son propre profil) */}
                  {isOwnProfile && (
                    <TabsTrigger
                      value="bookmarks"
                      className="flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-stragram-primary data-[state=active]:text-stragram-primary rounded-none"
                    >
                      ENREGISTREMENTS ({state.totalBookmarks})
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="posts" className="p-0 mt-0">
                  {state.posts.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      Aucune publication
                    </div>
                  ) : (
                    <>
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
                                alt={post.description || 'Post'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback si l'image n'existe pas sur le serveur
                                  e.currentTarget.style.display = 'none';
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="w-full h-full bg-gray-100 flex items-center justify-center p-4">
                                        <p class="text-sm text-gray-600 line-clamp-4 text-center">
                                          ${post.description || "Image non disponible"}
                                        </p>
                                      </div>
                                    `;
                                  }
                                }}
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
                    </>
                  )}
                </TabsContent>
                
                {/* ✅ NOUVEAU: Onglet Likes/Favorites */}
                {isOwnProfile && (
                  <TabsContent value="likes" className="p-0 mt-0">
                    {state.likedPosts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 mb-4 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <p className="text-lg font-medium">Aucun post liké</p>
                        <p className="text-sm text-gray-400">Les posts que vous aimez apparaîtront ici</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-1">
                          {state.likedPosts.map((post) => (
                            <Link
                              key={post.id}
                              to={`/p/${post.id}`}
                              className="aspect-square overflow-hidden hover:opacity-90 transition-opacity cursor-pointer relative"
                            >
                              {post.imageUrl ? (
                                <img
                                  src={post.imageUrl}
                                  alt={post.description || 'Post'}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                      parent.innerHTML = `
                                        <div class="w-full h-full bg-gray-100 flex items-center justify-center p-4">
                                          <p class="text-sm text-gray-600 line-clamp-4 text-center">
                                            ${post.description || "Image non disponible"}
                                          </p>
                                        </div>
                                      `;
                                    }
                                  }}
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
                        {state.hasMoreLikes && (
                          <div className="text-center py-4">
                            <Button variant="outline" onClick={loadMoreLikes} disabled={state.loading}>
                              {state.loading ? "Chargement..." : "Charger plus"}
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </TabsContent>
                )}
                
                {/* ✅ Onglet Enregistrements */}
                {isOwnProfile && (
                  <TabsContent value="bookmarks" className="p-0 mt-0">
                    {state.bookmarkedPosts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 mb-4 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                        <p className="text-lg font-medium">Aucun post enregistré</p>
                        <p className="text-sm text-gray-400">Les posts que vous enregistrez apparaîtront ici</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-1">
                          {state.bookmarkedPosts.map((post) => (
                            <Link
                              key={post.id}
                              to={`/p/${post.id}`}
                              className="aspect-square overflow-hidden hover:opacity-90 transition-opacity cursor-pointer relative"
                            >
                              {post.imageUrl ? (
                                <img
                                  src={post.imageUrl}
                                  alt={post.description || 'Post'}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback si l'image n'existe pas sur le serveur
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                      parent.innerHTML = `
                                        <div class="w-full h-full bg-gray-100 flex items-center justify-center p-4">
                                          <p class="text-sm text-gray-600 line-clamp-4 text-center">
                                            ${post.description || "Image non disponible"}
                                          </p>
                                        </div>
                                      `;
                                    }
                                  }}
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
                        {state.hasMoreBookmarks && (
                          <div className="text-center py-4">
                            <Button variant="outline" onClick={loadMoreBookmarks} disabled={state.loading}>
                              {state.loading ? "Chargement..." : "Charger plus"}
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        </div>
        <RightBar />
      </div>
      
      {/* Dialog pour afficher les followers/following */}
      {state.user && (
        <FollowersFollowingDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          userId={state.user.id}
          initialTab={dialogInitialTab}
          followersCount={state.user.followersCount}
          followingCount={state.user.followingCount}
        />
      )}
    </div>
  );
};

export default UserProfile;