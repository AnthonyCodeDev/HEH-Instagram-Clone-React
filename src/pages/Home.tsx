import { useState } from "react";
import { Search, Heart, Bookmark, Image } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import QuickAdd from "@/components/QuickAdd";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import sunsetBeach from "@/assets/sunset-beach.jpg";

const Home = () => {
  const [newPostText, setNewPostText] = useState("");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex max-w-none">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Accueil</h1>

            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans Stragram"
                className="pl-10 h-10 bg-white rounded-full border-gray-200"
              />
            </div>
          </div>

          {/* New Post Input */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Button variant="ghost" size="icon" className="text-stragram-primary hover:text-stragram-primary/80">
                  <Image className="w-5 h-5" />
                </Button>
                <textarea
                  placeholder="Bonjour moi c'est..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  className="flex-1 h-12 resize-none border-0 placeholder-gray-400 text-gray-900 focus:outline-none bg-transparent"
                />
                <Button variant="stragram" size="sm" className="px-6">
                  Publier
                </Button>
              </div>
            </div>
          </div>

          {/* Main Post */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Post Header */}
            <div className="flex items-start gap-3 p-6 pb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                  alt="Lucas Hergz"
                />
                <AvatarFallback>LH</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">Lucas Hergz</h3>
                  <Badge variant="destructive" className="w-4 h-4 p-0 bg-stragram-primary rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">@lucashergz20</p>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-6 pb-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-gray-900 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi laoreet libero eget lacus mattis, ut luctus augue pulvinar.
                  </p>
                  <p className="text-gray-900 leading-relaxed">
                    Nullam eget tempus est, sed porta odio. Curabitur ut turpis luctus, volutpat nisl semper, posuere justo.
                  </p>
                  <p className="text-gray-900 leading-relaxed">
                    Rejoignez-moi sur <span className="text-stragram-primary">stragram.fr/johndoe</span>
                  </p>
                </div>

                <div className="rounded-xl overflow-hidden">
                  <img
                    src={sunsetBeach}
                    alt="Post content"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Post Actions */}
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500 text-sm">256 likes</span>
              </div>

              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                <Bookmark className="w-5 h-5" />
              </Button>
            </div>

            {/* Bottom Profile */}
            <div className="px-6 pb-6 pt-2">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                    alt="Lucas Hergz"
                  />
                  <AvatarFallback>LH</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">Lucas Hergz</span>
                    <Badge variant="destructive" className="w-3 h-3 p-0 bg-stragram-primary rounded-full flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">@lucashergz20</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 p-6 flex-shrink-0">
          <QuickAdd />
        </div>
      </div>
    </div>
  );
};

export default Home;