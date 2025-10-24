import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Image, X, Loader2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import RightBar from "@/components/RightBar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import PostWithComments, { Comment, PostData } from "@/components/PostWithComments";


// Type pour la réponse de l'API des posts récents
interface ApiPostResponse {
  posts: {
    id: string;
    authorId: string;
    authorUsername: string;
    authorAvatarUrl: string | null;
    imageUrl: string | null;
    description: string;
    likeCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
    likedByCurrentUser: boolean; // Nom correct selon la réponse de l'API
    favoritedByCurrentUser: boolean; // Nom correct selon la réponse de l'API
  }[];
  page: number;
  size: number;
  hasMore: boolean;
}

const Home = () => {
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [newPostFile, setNewPostFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const composeRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();

  // Récupérer l'ID de l'utilisateur connecté
  useEffect(() => {
    const getUserId = async () => {
      try {
        // Essayer d'abord de récupérer l'ID depuis le localStorage
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          setCurrentUserId(storedUserId);
        }

        // Ensuite, essayer de le récupérer depuis l'API
        const token = localStorage.getItem('token');
        if (!token) return;

        // Appel API silencieux
        const response = await fetch('http://localhost:8081/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData && userData.id) {
            setCurrentUserId(userData.id);
            localStorage.setItem('userId', userData.id);
          }
        } else {
          // En cas d'erreur, utiliser l'ID du localStorage (déjà fait)
        }
      } catch (error) {
        // Gérer silencieusement l'erreur
        // L'ID du localStorage est déjà utilisé si disponible
      }
    };

    getUserId();
  }, []);

  // Fonction pour récupérer les posts récents depuis l'API
  const fetchRecentPosts = useCallback(async (page: number = 0, size: number = 10) => {
    try {
      // Récupérer le token JWT depuis le localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié');
      }

      // console.log(`Requête API: GET /posts/recent?page=${page}&size=${size}`);
      // console.log('Token utilisé:', token.substring(0, 10) + '...');

      const response = await fetch(`http://localhost:8081/posts/recent?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erreur ${response.status}`);
      }

      const data = await response.json() as ApiPostResponse;
      // console.log('Réponse API complète:', data);

      // Vérifier spécifiquement les valeurs de likedByCurrentUser
      data.posts.forEach(post => {
        // console.log(`Post ${post.id} - likedByCurrentUser:`, post.likedByCurrentUser,
        //   `(type: ${typeof post.likedByCurrentUser})`);
      });

      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des posts récents:', error);
      throw error;
    }
  }, []);

  // Fonction pour envoyer un post à l'API
  const sendPostToAPI = async (imageFile: File | null, description: string) => {
    try {
      // Récupérer le token JWT depuis le localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié');
      }

      // Créer un objet FormData
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      }
      formData.append('description', description);

      // Envoyer la requête à l'API
      const response = await fetch('http://localhost:8081/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du post:', error);
      throw error;
    }
  };

  // Fonction pour liker un post
  const likePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`http://localhost:8081/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors du like:', error);
      throw error;
    }
  };

  // Fonction pour unliker un post
  const unlikePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`http://localhost:8081/posts/${postId}/like`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erreur ${response.status}`);
      }

      // La réponse est vide avec un statut 204
      return true;
    } catch (error) {
      console.error('Erreur lors du unlike:', error);
      throw error;
    }
  };

  // Fonction pour supprimer un post
  const deletePost = async (postId: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié');
      }

      // Trouver l'index du post à supprimer avant de le supprimer
      const postIndex = posts.findIndex(post => post.id === postId);
      if (postIndex === -1) {
        throw new Error('Post non trouvé');
      }

      // Déclencher immédiatement l'animation de suppression
      setPosts(prevPosts => {
        const updatedPosts = [...prevPosts];
        if (updatedPosts[postIndex]) {
          updatedPosts[postIndex] = { ...updatedPosts[postIndex], isDeleting: true };
        }
        return updatedPosts;
      });

      // Faire l'appel API en parallèle avec l'animation
      const apiCall = fetch(`http://localhost:8081/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Attendre que l'animation soit bien visible (durée plus courte)
      const animationDelay = new Promise(resolve => setTimeout(resolve, 300));

      // Attendre que les deux promesses soient résolues
      const [response] = await Promise.all([apiCall, animationDelay]);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erreur ${response.status}`);
      }

      // Supprimer le post de l'état local après l'animation
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      setPostStates(prevStates => prevStates.filter((_, idx) => posts[idx].id !== postId));
    } catch (error) {
      // Gérer silencieusement l'erreur
      throw error;
    }
  };

  // Fonction pour ajouter un post aux favoris
  const favoritePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`http://localhost:8081/posts/${postId}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      throw error;
    }
  };

  // Fonction pour retirer un post des favoris
  const unfavoritePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`http://localhost:8081/posts/${postId}/favorite`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erreur ${response.status}`);
      }

      // La réponse est vide avec un statut 204
      return true;
    } catch (error) {
      console.error('Erreur lors du retrait des favoris:', error);
      throw error;
    }
  };

  // Effet pour gérer le focus initial si nécessaire
  useEffect(() => {
    // Si on vient d'une autre page et qu'on a le paramètre write=true
    const params = new URLSearchParams(location.search);
    if (params.get("write") === "true" && composeRef.current) {
      composeRef.current.focus();
      composeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });

      // Nettoyer l'URL
      if (window.history.replaceState) {
        window.history.replaceState({}, "", "/");
      }
    }
  }, [location.search]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // State pour les posts
  const [posts, setPosts] = useState<PostData[]>([]);

  // Per-post UI state (like/save)
  const [postStates, setPostStates] = useState<{ liked: boolean; saved: boolean; likes: number; }[]>([]);

  // Charger les posts récents au chargement de la page
  useEffect(() => {
    const loadRecentPosts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRecentPosts(currentPage);

        // Convertir les données de l'API

        // Convertir les données de l'API au format attendu par le composant PostWithComments
        const formattedPosts = data.posts.map(post => ({
          id: post.id,
          authorId: post.authorId, // Ajouter l'ID de l'auteur directement dans le post
          user: {
            id: post.authorId, // Ajouter l'ID de l'auteur dans l'objet user
            name: post.authorUsername, // Utiliser le nom d'utilisateur comme nom complet
            username: post.authorUsername,
            avatar: post.authorAvatarUrl || null
          },
          content: post.description,
          image: post.imageUrl,
          comments: [] // Les commentaires seront chargés séparément si nécessaire
        }));

        setPosts(formattedPosts);
        setHasMorePosts(data.hasMore);

        // Initialiser les états des posts en s'assurant que les valeurs sont correctes
        const postStatesFromAPI = data.posts.map(post => {
          // Convertir explicitement en booléen pour éviter les problèmes de type
          const isLiked = post.likedByCurrentUser === true;
          const isSaved = post.favoritedByCurrentUser === true;


          return {
            liked: isLiked,
            saved: isSaved,
            likes: post.likeCount || 0 // S'assurer qu'il y a toujours une valeur
          };
        });

        setPostStates(postStatesFromAPI);
      } catch (error) {
        console.error("Erreur lors du chargement des posts récents:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les posts récents",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentPosts();
  }, [fetchRecentPosts, currentPage]);

  // Mettre à jour les états des posts quand posts change
  useEffect(() => {
    // Éviter de référencer postStates dans l'effet pour éviter les boucles
    if (posts.length > 0 && postStates.length !== posts.length) {
      setPostStates(prevStates => {
        // S'assurer que nous avons un état pour chaque post
        const newStates = posts.map((post, idx) => {
          // Conserver les états existants si disponibles
          if (idx < prevStates.length) {
            return prevStates[idx];
          }
          // Sinon, créer un nouvel état pour les nouveaux posts
          return { liked: false, saved: false, likes: 0 };
        });
        return newStates;
      });
    }
  }, [posts.length, postStates.length]);

  // État pour suivre les posts en cours de like/unlike et favorite/unfavorite
  const [likingPosts, setLikingPosts] = useState<Record<string, boolean>>({});
  const [savingPosts, setSavingPosts] = useState<Record<string, boolean>>({});

  const toggleLike = async (index: number) => {
    const post = posts[index];
    if (!post || likingPosts[post.id]) return; // Éviter les clics multiples

    try {
      // Récupérer l'état actuel du like avant toute modification
      const currentlyLiked = postStates[index].liked;

      // Marquer ce post comme en cours de like/unlike
      setLikingPosts(prev => ({ ...prev, [post.id]: true }));

      // Mise à jour optimiste de l'UI
      setPostStates((prev) => {
        const next = [...prev];
        const newLikedState = !currentlyLiked;
        // console.log(`Mise à jour optimiste: ${currentlyLiked ? 'liké' : 'non liké'} -> ${newLikedState ? 'liké' : 'non liké'}`);

        next[index] = {
          ...next[index],
          liked: newLikedState,
          likes: next[index].likes + (currentlyLiked ? -1 : 1),
        };
        return next;
      });

      // Appel à l'API
      if (currentlyLiked) {
        // Le post était déjà liké, on l'unlike
        // console.log(`Appel API: unlike post ${post.id}`);
        await unlikePost(post.id);
      } else {
        // Le post n'était pas liké, on le like
        // console.log(`Appel API: like post ${post.id}`);
        await likePost(post.id);
      }
    } catch (error) {
      console.error('Erreur lors du toggle like:', error);

      // En cas d'erreur, annuler la mise à jour optimiste
      setPostStates((prev) => {
        const next = [...prev];
        const currentlyLiked = next[index].liked;
        next[index] = {
          ...next[index],
          liked: !currentlyLiked,
          likes: next[index].likes + (currentlyLiked ? 1 : -1),
        };
        return next;
      });

      // Rafraîchir les données du post depuis l'API pour s'assurer de la cohérence
      try {
        const updatedPostData = await fetchRecentPosts(currentPage, 1);
        const updatedPost = updatedPostData.posts.find(p => p.id === post.id);
        if (updatedPost) {
          // Mettre à jour l'état du like avec les données fraîches du serveur
          setPostStates(prev => {
            const next = [...prev];
            next[index] = {
              ...next[index],
              liked: updatedPost.likedByCurrentUser === true,
              likes: updatedPost.likeCount
            };
            return next;
          });
        }
      } catch (refreshError) {
        console.error('Erreur lors du rafraîchissement des données du post:', refreshError);
      }

      // Afficher un message d'erreur
      toast({
        title: "Erreur",
        description: "Impossible de modifier le like",
        variant: "destructive"
      });
    } finally {
      // Récupérer l'état actuel du post depuis l'API pour s'assurer de la cohérence
      try {
        // Attendre un peu pour que le serveur ait le temps de traiter la requête précédente
        await new Promise(resolve => setTimeout(resolve, 300));

        // Récupérer les données fraîches du post
        const token = localStorage.getItem('token');
        if (token) {
          // console.log(`Vérification de l'état du post ${post.id} après like/unlike`);
          const response = await fetch(`http://localhost:8081/posts/${post.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const updatedPost = await response.json();
            // console.log('Post mis à jour depuis l\'API:', updatedPost);
            // console.log(`État du like: ${updatedPost.isLikedByCurrentUser ? 'liké' : 'non liké'}`);

            // Mettre à jour l'état du post avec les données fraîches
            setPostStates(prev => {
              const next = [...prev];
              next[index] = {
                ...next[index],
                liked: updatedPost.likedByCurrentUser === true,
                likes: updatedPost.likeCount || 0
              };
              return next;
            });
          }
        }
      } catch (refreshError) {
        console.error('Erreur lors de la vérification de l\'\u00e9tat du post:', refreshError);
      }

      // Marquer ce post comme n'étant plus en cours de like/unlike
      setLikingPosts(prev => {
        const next = { ...prev };
        delete next[post.id];
        return next;
      });
    }
  };

  const toggleSave = async (index: number) => {
    const post = posts[index];
    if (!post || savingPosts[post.id]) return; // Éviter les clics multiples

    try {
      // Récupérer l'état actuel du favori avant toute modification
      const currentlySaved = postStates[index].saved;
      // console.log(`Toggle favori pour le post ${post.id} - État actuel: ${currentlySaved ? 'favori' : 'non favori'}`);

      // Marquer ce post comme en cours de favorite/unfavorite
      setSavingPosts(prev => ({ ...prev, [post.id]: true }));

      // Mise à jour optimiste de l'UI
      setPostStates((prev) => {
        const next = [...prev];
        const newSavedState = !currentlySaved;
        // console.log(`Mise à jour optimiste: ${currentlySaved ? 'favori' : 'non favori'} -> ${newSavedState ? 'favori' : 'non favori'}`);

        next[index] = {
          ...next[index],
          saved: newSavedState
        };
        return next;
      });

      // Appel à l'API
      if (currentlySaved) {
        // Le post était déjà en favori, on le retire
        // console.log(`Appel API: unfavorite post ${post.id}`);
        await unfavoritePost(post.id);
      } else {
        // Le post n'était pas en favori, on l'ajoute
        // console.log(`Appel API: favorite post ${post.id}`);
        await favoritePost(post.id);
      }
    } catch (error) {
      console.error('Erreur lors du toggle favori:', error);

      // En cas d'erreur, annuler la mise à jour optimiste
      setPostStates((prev) => {
        const next = [...prev];
        const currentlySaved = next[index].saved;
        next[index] = {
          ...next[index],
          saved: !currentlySaved
        };
        return next;
      });

      // Afficher un message d'erreur
      toast({
        title: "Erreur",
        description: "Impossible de modifier le favori",
        variant: "destructive"
      });
    } finally {
      // Récupérer l'état actuel du post depuis l'API pour s'assurer de la cohérence
      try {
        // Attendre un peu pour que le serveur ait le temps de traiter la requête précédente
        await new Promise(resolve => setTimeout(resolve, 300));

        // Récupérer les données fraîches du post
        const token = localStorage.getItem('token');
        if (token) {
          // console.log(`Vérification de l'état du post ${post.id} après favorite/unfavorite`);
          const response = await fetch(`http://localhost:8081/posts/${post.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const updatedPost = await response.json();
            // console.log('Post mis à jour depuis l\'API:', updatedPost);
            // console.log(`État du favori: ${updatedPost.favoritedByCurrentUser ? 'favori' : 'non favori'}`);

            // Mettre à jour l'état du post avec les données fraîches
            setPostStates(prev => {
              const next = [...prev];
              next[index] = {
                ...next[index],
                saved: updatedPost.favoritedByCurrentUser === true
              };
              return next;
            });
          }
        }
      } catch (refreshError) {
        console.error('Erreur lors de la vérification de l\'\u00e9tat du post:', refreshError);
      }

      // Marquer ce post comme n'étant plus en cours de favorite/unfavorite
      setSavingPosts(prev => {
        const next = { ...prev };
        delete next[post.id];
        return next;
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex max-w-none h-full overflow-x-hidden">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
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
              Accueil
            </h1>

          </div>

          {/* New Post Input */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="space-y-4">
              {/* Text Area */}
              <textarea
                ref={composeRef}
                placeholder="Bonjour moi c'est..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="w-full h-20 resize-none border-0 placeholder-gray-400 text-gray-900 focus:outline-none bg-transparent text-base"
              />

              {/* Image preview if selected */}
              {newPostImage && (
                <div className="relative">
                  <img
                    src={newPostImage}
                    alt="Selected"
                    className="w-full max-h-80 object-contain rounded-lg"
                  />
                  <button
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                    onClick={(e) => {
                      e.preventDefault();
                      setNewPostImage(null);
                      // Réinitialiser la valeur de l'input file pour permettre la sélection du même fichier
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Bottom Row */}
              <div className="flex items-center justify-between">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setNewPostFile(file); // Stocker le fichier pour l'envoi API

                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          setNewPostImage(event.target.result as string);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-stragram-primary hover:text-stragram-primary/80"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  <Image className="w-5 h-5" />
                </Button>

                <button
                  className="w-24 h-9 bg-[#EC3558] text-white text-sm font-medium rounded-[11px] hover:bg-[#EC3558]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || (!newPostText.trim() && !newPostFile)}
                  onClick={async (e) => {
                    // Empêcher le comportement par défaut du bouton
                    e.preventDefault();

                    // Vérifier qu'il y a du contenu à publier
                    if (!newPostText.trim() && !newPostFile) {
                      toast({
                        title: "Erreur",
                        description: "Veuillez ajouter du texte ou une image pour votre post",
                        variant: "destructive"
                      });
                      return;
                    }

                    setIsSubmitting(true);

                    try {
                      // Envoyer le post à l'API (avec ou sans image)
                      const postData = await sendPostToAPI(newPostFile, newPostText.trim());

                      // Créer un nouveau post avec les données de l'API
                      const newPost = {
                        id: postData.id,
                        authorId: postData.authorId || currentUserId, // Ajouter l'ID de l'auteur
                        user: {
                          id: postData.authorId || currentUserId, // Ajouter l'ID de l'auteur dans l'objet user
                          name: postData.authorUsername, // Utiliser les données de l'API
                          username: postData.authorUsername,
                          avatar: postData.authorAvatarUrl || null
                        },
                        content: postData.description,
                        image: postData.imageUrl, // Peut être undefined si pas d'image
                        comments: [],
                        commentCount: 0 // Initialiser le compteur de commentaires
                      };

                      // Ajouter le nouveau post au début du flux
                      setPosts(prevPosts => [newPost, ...prevPosts]);

                      // Mettre à jour les états des posts pour inclure le nouveau post
                      setPostStates(prevStates => [
                        { liked: false, saved: false, likes: 0 },
                        ...prevStates
                      ]);

                      toast({
                        title: "Succès",
                        description: "Votre post a été publié"
                      });

                      // Reset form
                      setNewPostText("");
                      setNewPostImage(null);
                      setNewPostFile(null);
                      // Réinitialiser l'input file
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    } catch (error) {
                      console.error("Erreur lors de la publication:", error);
                      toast({
                        title: "Erreur",
                        description: error instanceof Error ? error.message : "Erreur lors de la publication",
                        variant: "destructive"
                      });
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    "Publier"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* État de chargement initial */}
          {isLoading && posts.length === 0 && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-stragram-primary" />
              <span className="ml-2 text-gray-600">Chargement des posts...</span>
            </div>
          )}

          {/* Message si aucun post */}
          {!isLoading && posts.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 text-center">
              <p className="text-gray-600">Aucun post à afficher pour le moment.</p>
              <p className="text-gray-500 text-sm mt-2">Soyez le premier à publier quelque chose !</p>
            </div>
          )}

          {/* Feed - posts récents */}
          {posts.map((post, i) => (
            <PostWithComments
              key={post.id || `${post.user.username}-${i}`}
              post={post as PostData}
              postState={postStates[i]}
              postIndex={i}
              onLike={toggleLike}
              onSave={toggleSave}
              onDeletePost={deletePost}
              isLiking={likingPosts}
              isSaving={savingPosts}
              currentUserId={currentUserId}
              onAddComment={(postIndex, comment) => {
                setPosts(prevPosts => {
                  const newPosts = [...prevPosts];
                  if (newPosts[postIndex]) {
                    const post = newPosts[postIndex];
                    // Ajouter le nouveau commentaire au début du tableau pour qu'il apparaisse en premier
                    const comments = [comment, ...((post as any).comments || [])];
                    (newPosts[postIndex] as any).comments = comments;
                  }
                  return newPosts;
                });
              }}
            />
          ))}

          {/* Bouton "Charger plus" pour la pagination */}
          {!isLoading && hasMorePosts && (
            <div className="flex justify-center my-6">
              <Button
                onClick={async () => {
                  try {
                    setLoadingMorePosts(true);
                    const nextPage = currentPage + 1;
                    const data = await fetchRecentPosts(nextPage);

                    // Convertir et ajouter les nouveaux posts
                    const formattedPosts = data.posts.map(post => ({
                      id: post.id,
                      user: {
                        name: post.authorUsername,
                        username: post.authorUsername,
                        avatar: post.authorAvatarUrl || undefined
                      },
                      content: post.description,
                      image: post.imageUrl,
                      comments: []
                    }));

                    setPosts(prev => [...prev, ...formattedPosts]);
                    setCurrentPage(nextPage);
                    setHasMorePosts(data.hasMore);

                    // Ajouter les états des nouveaux posts
                    setPostStates(prev => [...prev, ...data.posts.map(post => ({
                      liked: post.likedByCurrentUser === true,
                      saved: post.favoritedByCurrentUser === true,
                      likes: post.likeCount || 0
                    }))]);
                  } catch (error) {
                    console.error("Erreur lors du chargement de plus de posts:", error);
                    toast({
                      title: "Erreur",
                      description: "Impossible de charger plus de posts",
                      variant: "destructive"
                    });
                  } finally {
                    setLoadingMorePosts(false);
                  }
                }}
                disabled={loadingMorePosts}
                variant="outline"
                className="w-40"
              >
                {loadingMorePosts ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  "Voir plus de posts"
                )}
              </Button>
            </div>
          )}

          {/* Indicateur de fin de liste */}
          {!isLoading && !hasMorePosts && posts.length > 0 && (
            <div className="text-center text-gray-500 my-6">
              Vous avez vu tous les posts récents
            </div>
          )}

          <Dialog open={!!previewImage} onOpenChange={(o) => !o && setPreviewImage(null)}>
            <DialogContent variant="bare">
              {previewImage && (
                <img src={previewImage} alt="Post content large" className="max-h-[85vh] w-auto object-contain" />
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Right Sidebar */}
        <RightBar />
      </div>
    </div>
  );
};

export default Home;