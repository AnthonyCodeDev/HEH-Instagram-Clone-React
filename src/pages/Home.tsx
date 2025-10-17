import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Image, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import RightBar from "@/components/RightBar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PostWithComments, { Comment, PostData } from "@/components/PostWithComments";
import sunsetBeach from "@/assets/sunset-beach.jpg";


const Home = () => {
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const composeRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();

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
  const [posts, setPosts] = useState([
    {
      id: "lucashergz20-photo-0",
      user: { name: "Lucas Hergz", username: "lucashergz20", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
      content: "Dernier jour à Bali avec ce coucher de soleil à couper le souffle sur la plage de Kuta. Trois semaines de voyage qui se terminent en beauté. Difficile de quitter ce paradis, mais plein de souvenirs et de photos à partager avec vous prochainement ! #Bali #Voyage #CoucherDeSoleil",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
      comments: [
        { author: "Tom", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200", text: "Ces couleurs sont incroyables ! Tu as utilisé quel filtre ?" },
        { author: "Lucie", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200", text: "Magnifique ! J'ai hâte de voir tes autres photos du voyage." },
        { author: "Marie", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", text: "Ça donne vraiment envie d'y aller. Tu conseilles quelle période pour visiter ?" },
        { author: "John", avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200", text: "La lumière est parfaite sur cette photo. Tu as utilisé quel appareil ?" },
        { author: "Paul", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200", text: "J'y étais le mois dernier ! Un endroit magique, profite bien de tes derniers moments." },
        { author: "Nina", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200", text: "Ces couleurs sont à tomber par terre ! Bon retour parmi nous." }
      ]
    },
    {
      id: "tomberton-photo-0",
      user: { name: "Tom Berton", username: "tomberton", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" },
      content: "Randonnée de 15km aujourd'hui dans les Alpes du Sud. Départ à l'aube pour atteindre ce point de vue exceptionnel à 2300m d'altitude. L'effort en valait vraiment la peine ! Prochain objectif : le Mont Blanc cet été. Qui serait partant pour l'aventure ? #Randonnée #Alpes #Nature",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
      comments: [
        { author: "Lucas", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", text: "Le spot a l'air incroyable ! Tu peux partager l'itinéraire en MP ?" },
        { author: "Lucie", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200", text: "Compte sur moi pour le Mont Blanc ! Je m'entraîne depuis des mois pour ça." },
        { author: "Marie", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", text: "Quelle vue ! Tu utilises quelle appli pour tracer tes parcours ?" }
      ]
    },
    {
      id: "luciemarinier10-photo-0",
      user: { name: "Lucie Marinier", username: "luciemarinier10", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400" },
      content: "Journée créative au studio aujourd'hui. Nouveau projet de design pour une marque éco-responsable qui me tient à cœur. Un bon café d'origine éthiopienne pour booster l'inspiration, et c'est parti pour une session de brainstorming ! ✨ #Design #Créativité #WorkInProgress",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200",
      comments: [
        { author: "Tom", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200", text: "Team espresso pour la productivité ! Hâte de voir ce nouveau projet." },
        { author: "Marie", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", text: "J'adore cette tasse ! Tu l'as trouvée où ? Bon courage pour le projet." },
        { author: "John", avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200", text: "Le café éthiopien est le meilleur pour la créativité. Tu utilises quelle méthode d'extraction ?" },
        { author: "Nina", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200", text: "Je travaille aussi avec des marques éco-responsables. On devrait échanger sur nos expériences !" }
      ]
    },
    {
      id: "mariemaring-photo-0",
      user: { name: "Marie Marind", username: "mariemaring", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400" },
      contentParagraphs: [
        "J'ai passé l'après-midi à tester une recette de tarte aux pommes revisitée avec des ingrédients de saison. La combinaison pommes-poires avec une touche de cardamome donne un résultat surprenant et délicieux. Le secret ? Une pâte feuilletée maison au beurre de baratte et un caramel légèrement salé qui se marie parfaitement avec les fruits caramélisés.",
        "Pour ceux qui me demandent souvent mes recettes, je publierai celle-ci en détail sur mon blog culinaire demain, avec toutes les étapes en photos. Et vous, quel est votre dessert réconfortant préféré pour l'automne ? Je cherche toujours de nouvelles inspirations pour mes prochaines créations en cuisine. #Pâtisserie #FaitmMaison #Automne"
      ],
      image: "https://images.unsplash.com/photo-1562007908-17c67e878c6b?w=1200",
      comments: [
        { author: "Lucas", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", text: "La cardamome est une super idée ! J'ai hâte de voir la recette complète sur ton blog." },
        { author: "Lucie", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200", text: "Elle est magnifique ! Pour moi, c'est le crumble aux pommes et aux fruits rouges qui me réconforte en automne." },
        { author: "Tom", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200", text: "Je vais essayer ta recette ce week-end. Tu conseilles quelles variétés de pommes ?" }
      ]
    },
    {
      id: "johndoe-photo-0",
      user: { name: "John Doe", username: "johndoe", avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400" },
      content: "Nouvelle playlist 'Urban Chill' disponible sur mon profil ! 2 heures de morceaux soigneusement sélectionnés entre électro minimaliste et hip-hop instrumental. Parfait pour travailler ou se détendre. N'hésitez pas à me dire ce que vous en pensez et à suggérer des artistes pour le prochain mix. Lien dans ma bio. #Musique #Playlist #UrbanChill",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200",
      comments: [
        { author: "Lucie", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200", text: "Je l'écoute depuis ce matin ! Le morceau de Bonobo à 1h24 est incroyable." },
        { author: "Tom", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200", text: "Parfait pour mes sessions de running. Tu devrais ajouter du Tycho dans ta prochaine playlist." },
        { author: "Marie", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", text: "La transition entre les morceaux est super fluide. Tu utilises quel logiciel pour mixer ?" },
        { author: "Lucas", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", text: "Excellente sélection ! Tu as pensé à la mettre sur SoundCloud aussi ?" }
      ]
    }
  ]);

  // Per-post UI state (like/save)
  const [postStates, setPostStates] = useState(
    posts.map((_, idx) => ({ liked: false, saved: false, likes: 200 + idx * 17 }))
  );

  // Mettre à jour les états des posts quand posts change
  useEffect(() => {
    // Éviter de référencer postStates dans l'effet pour éviter les boucles
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
                  onClick={(e) => {
                    // Empêcher le comportement par défaut du bouton
                    e.preventDefault();

                    // Vérifier qu'il y a du contenu à publier
                    if (!newPostText.trim() && !newPostImage) return;

                    // Créer un nouveau post
                    const newPost = {
                      id: `bahsonnom-photo-${new Date().getTime()}`,
                      user: {
                        name: "Bahson Nom",
                        username: "bahsonnom",
                        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
                      },
                      content: newPostText.trim(),
                      image: newPostImage || undefined,
                      comments: []
                    };

                    try {
                      // Ajouter le nouveau post au début du flux
                      setPosts(prevPosts => [newPost, ...prevPosts]);

                      // Mettre à jour les états des posts pour inclure le nouveau post
                      setPostStates(prevStates => [
                        { liked: false, saved: false, likes: 0 },
                        ...prevStates
                      ]);

                      // Reset form
                      setNewPostText("");
                      setNewPostImage(null);
                      // Réinitialiser l'input file
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    } catch (error) {
                      console.error("Erreur lors de la publication:", error);
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
            <PostWithComments
              key={post.user.username + i}
              post={post as PostData}
              postState={postStates[i]}
              postIndex={i}
              onLike={toggleLike}
              onSave={toggleSave}
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