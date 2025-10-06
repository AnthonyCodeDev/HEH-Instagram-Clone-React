import { useLocation, useParams, Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import QuickAdd from "@/components/QuickAdd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

type LocationState = {
    image?: string;
    content?: string;
    user?: { name: string; username: string; avatar: string; };
};

const ProfilePost = () => {
    const { postId, username } = useParams();
    const location = useLocation();
    const state = (location.state || {}) as LocationState;
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likes, setLikes] = useState(256);
    const [showMoreComments, setShowMoreComments] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const user = {
        name: "Lucas Hergz",
        username: "lucashergz20",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    };

    const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi laoreet libero eget lacus mattis, ut luctus augue pulvinar.";
    const image = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200";

    const comments = [
        { user: { name: "Tom", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" }, text: "Magnifique coucher de soleil !" },
        { user: { name: "Lucie", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200" }, text: "Ohh superbe ! tu vois" },
        { user: { name: "Marie", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200" }, text: "Ça donne envie de voyager." },
        { user: { name: "John", avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200" }, text: "Incroyable photo, comme d'habitude !" },
        { user: { name: "Anna", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" }, text: "J'adore les couleurs !" }
    ];

    const visibleComments = showMoreComments ? comments : comments.slice(0, 3);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex max-w-none h-full">
                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 last:mb-0 max-w-3xl mx-auto">
                        {/* Header */}
                        <Link to={`/u/${user.username}`} className="flex items-start gap-3 p-6 pb-4 no-underline hover:no-underline">
                            <div className="shrink-0">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">{user.name}</span>
                                </div>
                                <span className="text-sm text-gray-500">@{user.username}</span>
                            </div>
                        </Link>

                        {/* Content */}
                        <div className="px-6 pb-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-gray-900 leading-relaxed">{content}</p>
                                </div>
                                <div
                                    className="rounded-xl overflow-hidden cursor-pointer"
                                    onClick={() => setPreviewImage(image)}
                                >
                                    <img src={image} alt="Post content" className="w-full h-auto object-cover" />
                                </div>
                            </div>
                        </div>

                        {/* Post Actions */}
                        <div className="px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                    <span>{likes} likes</span>
                                </Button>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleBookmark}
                                className={`${isBookmarked ? 'text-black hover:text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                            </Button>
                        </div>

                        {/* Comments */}
                        <div className="px-6 pb-6 pt-2 space-y-3">
                            {visibleComments.map((comment, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="shrink-0">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                                            <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="bg-gray-100 rounded-xl px-3 py-2 text-sm text-gray-800">
                                        <span className="font-semibold mr-1">{comment.user.name}</span>
                                        {comment.text}
                                    </div>
                                </div>
                            ))}
                            {comments.length > 3 && (
                                <Button
                                    variant="link"
                                    onClick={() => setShowMoreComments(!showMoreComments)}
                                    className="text-sm text-stragram-primary hover:underline px-0"
                                >
                                    {showMoreComments ? "Voir moins" : "Voir plus"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-96 p-6 flex-shrink-0 overflow-y-auto">
                    <QuickAdd />
                </div>
            </div>

            {/* Modal pour afficher l'image en plein écran */}
            <Dialog open={!!previewImage} onOpenChange={(o) => !o && setPreviewImage(null)}>
                <DialogContent variant="bare">
                    {previewImage && (
                        <img src={previewImage} alt="Post content large" className="max-h-[85vh] w-auto object-contain" />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProfilePost;


