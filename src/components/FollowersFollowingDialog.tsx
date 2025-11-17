import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { followService } from "@/services/followService";
import { userService } from "@/services/userService";
import type { FollowerItem, FollowingItem } from "@/types/follow";
import { Link } from "react-router-dom";

interface FollowersFollowingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  initialTab?: "followers" | "following";
  followersCount?: number;
  followingCount?: number;
}

const FollowersFollowingDialog = ({
  open,
  onOpenChange,
  userId,
  initialTab = "followers",
  followersCount = 0,
  followingCount = 0
}: FollowersFollowingDialogProps) => {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(initialTab);
  
  // State pour les followers
  const [followers, setFollowers] = useState<FollowerItem[]>([]);
  const [followersPage, setFollowersPage] = useState(0);
  const [followersTotalCount, setFollowersTotalCount] = useState(followersCount);
  const [hasMoreFollowers, setHasMoreFollowers] = useState(false);
  const [loadingFollowers, setLoadingFollowers] = useState(false);

  // State pour les following
  const [following, setFollowing] = useState<FollowingItem[]>([]);
  const [followingPage, setFollowingPage] = useState(0);
  const [followingTotalCount, setFollowingTotalCount] = useState(followingCount);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  // State pour gérer les actions follow/unfollow
  const [followingUsers, setFollowingUsers] = useState<Record<string, boolean>>({});

  // Charger les followers
  const fetchFollowers = async (pageNum: number) => {
    if (loadingFollowers) return;
    
    setLoadingFollowers(true);
    try {
      const data = await followService.getFollowers(userId, pageNum, 20);
      
      setFollowers(prev => pageNum === 0 ? data.followers : [...prev, ...data.followers]);
      setFollowersTotalCount(data.totalCount);
      setHasMoreFollowers(data.hasMore);
      setFollowersPage(pageNum);
    } catch (error) {
      console.error('Error fetching followers:', error);
    } finally {
      setLoadingFollowers(false);
    }
  };

  // Charger les following
  const fetchFollowing = async (pageNum: number) => {
    if (loadingFollowing) return;
    
    setLoadingFollowing(true);
    try {
      const data = await followService.getFollowing(userId, pageNum, 20);
      
      setFollowing(prev => pageNum === 0 ? data.following : [...prev, ...data.following]);
      setFollowingTotalCount(data.totalCount);
      setHasMoreFollowing(data.hasMore);
      setFollowingPage(pageNum);
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoadingFollowing(false);
    }
  };

  // Charger les données quand le dialog s'ouvre
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
      if (initialTab === "followers" && followers.length === 0) {
        fetchFollowers(0);
      } else if (initialTab === "following" && following.length === 0) {
        fetchFollowing(0);
      }
    }
  }, [open, initialTab]);

  // Charger les données quand on change d'onglet
  useEffect(() => {
    if (open) {
      if (activeTab === "followers" && followers.length === 0) {
        fetchFollowers(0);
      } else if (activeTab === "following" && following.length === 0) {
        fetchFollowing(0);
      }
    }
  }, [activeTab, open]);

  // Gérer le follow/unfollow
  const handleFollowToggle = async (targetUserId: string, isCurrentlyFollowing: boolean) => {
    if (followingUsers[targetUserId]) return; // Éviter les double-clics

    setFollowingUsers(prev => ({ ...prev, [targetUserId]: true }));

    try {
      if (isCurrentlyFollowing) {
        await userService.unfollowUser(targetUserId);
      } else {
        await userService.followUser(targetUserId);
      }

      // Mettre à jour l'état local
      setFollowers(prev => prev.map(user => 
        user.id === targetUserId 
          ? { ...user, isCurrentUserFollowing: !isCurrentlyFollowing }
          : user
      ));

      setFollowing(prev => prev.map(user => 
        user.id === targetUserId 
          ? { ...user, isCurrentUserFollowing: !isCurrentlyFollowing }
          : user
      ));
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowingUsers(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  const UserItem = ({ user, isFollower = false }: { user: FollowerItem | FollowingItem; isFollower?: boolean }) => (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors">
      <Link 
        to={`/u/${user.username}`} 
        className="flex items-center gap-3 flex-1"
        onClick={() => onOpenChange(false)}
      >
        <Avatar className="w-12 h-12">
          <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
          <AvatarFallback>{user.name?.[0] || user.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {user.name || user.username}
          </p>
          <p className="text-sm text-gray-500 truncate">@{user.username}</p>
          {user.bio && (
            <p className="text-sm text-gray-600 truncate mt-1">{user.bio}</p>
          )}
        </div>
      </Link>
      <Button
        variant={user.isCurrentUserFollowing ? "outline" : "default"}
        size="sm"
        onClick={() => handleFollowToggle(user.id, user.isCurrentUserFollowing)}
        disabled={followingUsers[user.id]}
        className="ml-3"
      >
        {user.isCurrentUserFollowing ? "Abonné" : "S'abonner"}
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-center">Abonnés et Abonnements</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "followers" | "following")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 h-auto border-b">
            <TabsTrigger
              value="followers"
              className="py-3 px-4 text-sm font-semibold data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-stragram-primary data-[state=active]:text-stragram-primary rounded-none"
            >
              Abonnés ({followersTotalCount})
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="py-3 px-4 text-sm font-semibold data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-stragram-primary data-[state=active]:text-stragram-primary rounded-none"
            >
              Abonnements ({followingTotalCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="followers" className="p-0 mt-0 overflow-y-auto max-h-[calc(80vh-180px)]">
            {followers.length === 0 && !loadingFollowers ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p className="text-lg font-medium">Aucun abonné</p>
                <p className="text-sm text-gray-400">Les personnes qui suivent cet utilisateur apparaîtront ici</p>
              </div>
            ) : (
              <>
                <div className="divide-y">
                  {followers.map(follower => (
                    <UserItem key={follower.id} user={follower} isFollower={true} />
                  ))}
                </div>
                {hasMoreFollowers && (
                  <div className="text-center py-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => fetchFollowers(followersPage + 1)}
                      disabled={loadingFollowers}
                    >
                      {loadingFollowers ? "Chargement..." : "Charger plus"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="following" className="p-0 mt-0 overflow-y-auto max-h-[calc(80vh-180px)]">
            {following.length === 0 && !loadingFollowing ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p className="text-lg font-medium">Aucun abonnement</p>
                <p className="text-sm text-gray-400">Les personnes suivies par cet utilisateur apparaîtront ici</p>
              </div>
            ) : (
              <>
                <div className="divide-y">
                  {following.map(user => (
                    <UserItem key={user.id} user={user} isFollower={false} />
                  ))}
                </div>
                {hasMoreFollowing && (
                  <div className="text-center py-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => fetchFollowing(followingPage + 1)}
                      disabled={loadingFollowing}
                    >
                      {loadingFollowing ? "Chargement..." : "Charger plus"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersFollowingDialog;
