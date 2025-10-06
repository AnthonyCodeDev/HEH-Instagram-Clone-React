import { useLocation, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import QuickAdd from "@/components/QuickAdd";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import PostWithComments, { Comment, PostData } from "@/components/PostWithComments";

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

    const user = {
        name: "Lucas Hergz",
        username: "lucashergz20",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    };

    const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi laoreet libero eget lacus mattis, ut luctus augue pulvinar.";
    const image = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200";

    const [comments, setComments] = useState([
        { user: { name: "Tom", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" }, text: "Magnifique coucher de soleil !" },
        { user: { name: "Lucie", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200" }, text: "Ohh superbe ! tu vois" },
        { user: { name: "Marie", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200" }, text: "Ça donne envie de voyager." },
        { user: { name: "John", avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200" }, text: "Incroyable photo, comme d'habitude !" },
        { user: { name: "Anna", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" }, text: "J'adore les couleurs !" }
    ]);


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
                    <div className="max-w-3xl mx-auto">
                        <PostWithComments
                            post={{
                                id: postId || "default-post-id",
                                user,
                                content,
                                image,
                                comments: comments.map(comment => ({
                                    author: comment.user.name,
                                    avatar: comment.user.avatar,
                                    text: comment.text
                                }))
                            }}
                            postState={{
                                liked: isLiked,
                                saved: isBookmarked,
                                likes
                            }}
                            postIndex={0}
                            onLike={() => handleLike()}
                            onSave={() => handleBookmark()}
                            onAddComment={(_, comment) => {
                                setComments(prevComments => [
                                    {
                                        user: {
                                            name: comment.author,
                                            avatar: comment.avatar
                                        },
                                        text: comment.text
                                    },
                                    ...prevComments
                                ]);
                            }}
                        />
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

export default ProfilePost;


