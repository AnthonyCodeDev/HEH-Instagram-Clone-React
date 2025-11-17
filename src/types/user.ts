export interface SocialLinks {
    tiktok?: string;
    youtube?: string;
    twitter?: string;
    // Ajoutez d'autres réseaux sociaux selon vos besoins
}

export interface UserResponse {
    id: string;
    username: string;
    name: string;
    email?: string;
    bio?: string;
    avatarUrl: string | null;
    bannerUrl?: string | null;
    phone?: string;             // ✅ NOUVEAU
    location?: string;          // ✅ NOUVEAU
    birthdate?: string;         // ✅ NOUVEAU (format: YYYY-MM-DD)
    followersCount?: number;
    followingCount?: number;
    createdAt?: string;
    isCurrentUserFollowing?: boolean;
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
    likedByCurrentUser: boolean;          // Backend utilise sans "is"
    bookmarkedByCurrentUser: boolean;     // Backend utilise sans "is"
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

export interface UpdateUserRequest {
    username: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
    name?: string;
    bannerUrl?: string;
    phone?: string;
    location?: string;
    birthdate?: string;        // format: YYYY-MM-DD
    socialLinks?: {
        tiktok?: string;
        twitter?: string;
        youtube?: string;
    };
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;       // min 8 caractères
}