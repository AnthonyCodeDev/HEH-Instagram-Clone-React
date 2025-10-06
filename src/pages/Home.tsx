import { useEffect, useRef, useState } from "react";
import { Heart, Bookmark, Image, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import QuickAdd from "@/components/QuickAdd";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import sunsetBeach from "@/assets/sunset-beach.jpg";

type Comment = { author: string; avatar: string; text: string; };

const PostComments = ({ comments }: { comments: Comment[]; }) => {
  const [visible, setVisible] = useState(3);
  const shown = comments.slice(0, visible);
  const hasMore = comments.length > visible;

  return (
    <div className="px-6 pb-6 pt-2">
      <div className="space-y-3">
        {shown.map((c, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="shrink-0">
              <Avatar className="w-8 h-8">
                <AvatarImage src={c.avatar} alt={c.author} />
                <AvatarFallback>{c.author[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div className="bg-gray-100 rounded-xl px-3 py-2 text-sm text-gray-800">
              <span className="font-semibold mr-1">{c.author}</span>
              {c.text}
            </div>
          </div>
        ))}
        {hasMore && (
          <button
            className="text-sm text-stragram-primary hover:underline"
            onClick={() => setVisible((v) => v + 5)}
          >
            Voir plus
          </button>
        )}
      </div>
    </div>
  );
};

const Home = () => {
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const composeRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("write") === "true" && composeRef.current) {
      composeRef.current.focus();
      composeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // State pour les posts
  const [posts, setPosts] = useState([
    {
      user: { name: "Lucas Hergz", username: "lucashergz20", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi laoreet libero eget lacus mattis, ut luctus augue pulvinar.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
      comments: [
        { author: "Tom", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200", text: "Magnifique coucher de soleil !" },
        { author: "Lucie", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200", text: "Ohh superbe ! tu vois" },
        { author: "Marie", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", text: "Ça donne envie de voyager." },
        { author: "John", avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200", text: "Incroyable lumière." },
        { author: "Paul", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200", text: "Top !" },
        { author: "Nina", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200", text: "J'adore." }
      ]
    },
    {
      user: { name: "Tom Berton", username: "tomberton", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" },
      content: "Randonnée incroyable aujourd'hui, l'air frais fait du bien !",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
      comments: [
        { author: "Lucas", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", text: "Le spot a l'air dingue !" },
        { author: "Lucie", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200", text: "Tu m'emmènes la prochaine ?" },
        { author: "Marie", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", text: "On veut l'itinéraire !" }
      ]
    },
    {
      user: { name: "Lucie Marinier", username: "luciemarinier10", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400" },
      content: "Un café et c'est reparti pour créer ✨",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200",
      comments: [
        { author: "Tom", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200", text: "Team espresso ☕" },
        { author: "Marie", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", text: "La tasse est trop belle !" },
        { author: "John", avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200", text: "Ça sent la productivité." },
        { author: "Nina", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200", text: "On bosse ensemble ?" }
      ]
    },
    {
      user: { name: "Marie Marind", username: "mariemaring", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400" },
      contentParagraphs: [
        "Aujourd'hui, j'avais envie de quelque chose de réconfortant et simple à partager avec vous. J'ai ressorti ma vieille recette de tarte aux pommes, celle qui parfume toute la maison et qui rappelle les goûters d'automne. Une pâte bien dorée, des pommes légèrement caramélisées, une pointe de cannelle… rien de compliqué, juste le plaisir de prendre le temps.",
        "Je vous mets la recette complète ce soir si ça vous tente. D'ailleurs, vous êtes plutôt tarte encore tiède avec une boule de glace, ou bien le lendemain au petit-déj' avec un café bien chaud ? Dites-moi, je prends toutes vos astuces pour la rendre encore meilleure !"
      ],
      image: undefined,
      comments: [
        { author: "Lucas", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", text: "J'arrive pour le dessert !" }
      ]
    },
    {
      user: { name: "John Doe", username: "johndoe", avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400" },
      content: "Nouvelle playlist dispo, dites-moi ce que vous en pensez !",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200",
      comments: [
        { author: "Lucie", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200", text: "J'adore le 3e titre." },
        { author: "Tom", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200", text: "Parfait pour courir." },
        { author: "Marie", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", text: "Je la mets en boucle." },
        { author: "Lucas", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", text: "Tu gères !" }
      ]
    }
  ]);

  // Per-post UI state (like/save)
  const [postStates, setPostStates] = useState(
    posts.map((_, idx) => ({ liked: false, saved: false, likes: 200 + idx * 17 }))
  );

  // Mettre à jour les états des posts quand posts change
  useEffect(() => {
    setPostStates(
      posts.map((post, idx) => {
        // Conserver les états existants si disponibles
        const existingState = postStates[idx];
        if (existingState) {
          return existingState;
        }
        // Sinon, créer un nouvel état
        return { liked: false, saved: false, likes: 0 };
      })
    );
  }, [posts.length]);

  const toggleLike = (index: number) => {
    setPostStates((prev) => {
      const next = [...prev];
      const wasLiked = next[index].liked;
      next[index] = {
        ...next[index],
        liked: !wasLiked,
        likes: next[index].likes + (wasLiked ? -1 : 1),
      };
      return next;
    });
  };

  const toggleSave = (index: number) => {
    setPostStates((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], saved: !next[index].saved };
      return next;
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex max-w-none h-full">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
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
                >
                  <Image className="w-5 h-5" />
                </Button>

                <button
                  className="w-24 h-9 bg-[#EC3558] text-white text-sm font-medium rounded-[11px] hover:bg-[#EC3558]/90 transition-colors"
                  onClick={() => {
                    // Vérifier qu'il y a du contenu à publier
                    if (!newPostText.trim() && !newPostImage) return;

                    // Créer un nouveau post
                    const newPost = {
                      user: {
                        name: "Bahson Nom",
                        username: "bahsonnom",
                        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
                      },
                      content: newPostText,
                      image: newPostImage || undefined,
                      comments: []
                    };

                    // Ajouter le nouveau post au début du flux
                    setPosts(prevPosts => [newPost, ...prevPosts]);

                    // Reset form
                    setNewPostText("");
                    setNewPostImage(null);
                    // Réinitialiser l'input file
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Publier
                </button>
              </div>
            </div>
          </div>

          {/* Feed - posts variés */}
          {posts.map((post, i) => (
            <div key={post.user.username + i} className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 last:mb-0">
              {/* Post Header (whole block clickable) */}
              <Link to={`/u/${post.user.username}`} className="flex items-start gap-3 p-6 pb-4">
                <div className="shrink-0">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={post.user.avatar}
                      alt={post.user.name}
                    />
                    <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{post.user.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">@{post.user.username}</span>
                </div>
              </Link>

              {/* Post Content */}
              <div className="px-6 pb-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-gray-900 leading-relaxed">{post.content}</p>
                  </div>

                  {post.image ? (
                    <div
                      className="rounded-xl overflow-hidden cursor-pointer"
                      onClick={() => setPreviewImage(post.image as string)}
                    >
                      <img
                        src={post.image as string}
                        alt="Post content"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ) : post.contentParagraphs ? (
                    <div className="space-y-3">
                      {post.contentParagraphs.map((p: string, idx: number) => (
                        <p key={idx} className="text-gray-900 leading-relaxed">{p}</p>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Post Actions */}
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    className={`flex items-center gap-2 transition-colors ${postStates[i].liked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => toggleLike(i)}
                  >
                    <Heart className={`w-5 h-5 ${postStates[i].liked ? 'fill-current' : ''}`} />
                    <span className="text-sm">{postStates[i].likes} likes</span>
                  </button>
                </div>

                <button
                  className={`transition-colors ${postStates[i].saved ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                  onClick={() => toggleSave(i)}
                  aria-label="Enregistrer pour plus tard"
                >
                  <Bookmark className={`w-5 h-5 ${postStates[i].saved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Comments */}
              <PostComments comments={(post as any).comments || []} />
            </div>
          ))}

          <Dialog open={!!previewImage} onOpenChange={(o) => !o && setPreviewImage(null)}>
            <DialogContent variant="bare">
              {previewImage && (
                <img src={previewImage} alt="Post content large" className="max-h-[85vh] w-auto object-contain" />
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 p-6 flex-shrink-0 overflow-y-auto">
          <QuickAdd />
        </div>
      </div>
    </div>
  );
};

export default Home;