export interface SocialLinks {
    tiktok?: string;
    instagram?: string;
    twitter?: string;
    // Ajoutez d'autres réseaux sociaux selon vos besoins
}

export interface UserResponse {
    id: string;
    username: string;
    email: string;
    bio: string;
    avatarUrl: string;
    followersCount: number;
    followingCount: number;
    createdAt: string;
    isCurrentUserFollowing: boolean;
    socialLinks?: SocialLinks;
}

export interface PostResponse {
    id: string;
    authorId: string;
    authorUsername: string;
    authorAvatarUrl: string;
    imageUrl: string;
    description: string;
    likeCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string | null;
    isLikedByCurrentUser: boolean;
    isFavoritedByCurrentUser: boolean;
}

export interface PostListResponse {
    posts: PostResponse[];
    page: number;
    size: number;
    hasMore: boolean;
}

export interface SearchUserResponse {
    users: SearchUserResponseItem[];
    page: number;
    size: number;
    hasMore: boolean;
}

export interface SearchUserResponseItem {
    id: string;
    username: string;
    avatarUrl: string | null;
    followersCount: number;
    followingCount: number;
    isCurrentUserFollowing: boolean;
}

export interface FollowResponse {
    followerId: string;
    followingId: string;
    createdAt: string;
}