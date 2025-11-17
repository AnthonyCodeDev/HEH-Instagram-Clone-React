import { useState } from "react";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { bookmarkService } from "@/services/bookmarkService";
import { toast } from "@/components/ui/use-toast";

interface PostProps {
  postId?: string;  // ✅ AJOUT: ID du post pour les bookmarks
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  timestamp: string;
  isBookmarked?: boolean;  // ✅ AJOUT: État initial du bookmark
  onBookmarkChange?: (postId: string, isBookmarked: boolean) => void;  // ✅ Callback pour mettre à jour l'état parent
}

const Post = ({ postId, user, content, image, likes, timestamp, isBookmarked: initialIsBookmarked = false, onBookmarkChange }: PostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // ✅ NOUVEAU: Gestion du bookmark avec appel API
  const handleBookmark = async () => {
    if (!postId) {
      console.warn('No post ID provided');
      return;
    }

    if (isBookmarking) return;  // Éviter les double-clics

    setIsBookmarking(true);

    try {
      if (isBookmarked) {
        await bookmarkService.unbookmarkPost(postId);
        setIsBookmarked(false);
        toast({
          title: "Enregistrement retiré",
          description: "Le post a été retiré de vos enregistrements.",
        });
        onBookmarkChange?.(postId, false);
      } else {
        await bookmarkService.bookmarkPost(postId);
        setIsBookmarked(true);
        toast({
          title: "Post enregistré",
          description: "Le post a été ajouté à vos enregistrements.",
        });
        onBookmarkChange?.(postId, true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de modifier l'enregistrement.",
        variant: "destructive",
      });
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
            </div>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <p className="text-gray-900 leading-relaxed">{content}</p>

        {image && (
          <>
            <div
              className="rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setIsImageOpen(true)}
            >
              <img
                src={image}
                alt="Post content"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  // Masquer l'image si elle ne charge pas
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
              <DialogContent variant="bare" hideClose={false}>
                <img 
                  src={image} 
                  alt="Post content large" 
                  className="max-h-[85vh] w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount} likes</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Commenter</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <Share className="w-5 h-5" />
            <span>Partager</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleBookmark}
          disabled={isBookmarking}
          className={`${isBookmarked ? 'text-stragram-primary hover:text-stragram-primary/80' : 'text-gray-400 hover:text-gray-600'
            } ${isBookmarking ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isBookmarked ? "Retirer des enregistrements" : "Enregistrer"}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Timestamp */}
      <p className="text-xs text-gray-400">{timestamp}</p>
    </div>
  );
};

export default Post;