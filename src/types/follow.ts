// Types pour la gestion des abonnés et abonnements

export interface FollowerItem {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  isCurrentUserFollowing: boolean;
}

export interface FollowingItem {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  isCurrentUserFollowing: boolean;
}

export interface FollowersResponse {
  followers: FollowerItem[];
  page: number;
  size: number;
  totalCount: number;
  hasMore: boolean;
}

export interface FollowingResponse {
  following: FollowingItem[];
  page: number;
  size: number;
  totalCount: number;
  hasMore: boolean;
}
