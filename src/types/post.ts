export interface PostResponse {
    id: string;
    authorId: string;
    authorUsername: string;
    authorAvatarUrl: string;
    imageUrl: string | null;
    description: string;
    likeCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string | null;
    likedByCurrentUser: boolean;          // Backend utilise sans "is"
    bookmarkedByCurrentUser: boolean;     // Backend utilise sans "is"
}

export interface Comment {
    id: string;
    authorId: string;
    authorUsername: string;
    authorAvatarUrl: string;
    content: string;
    createdAt: string;
    updatedAt: string | null;
}

export interface CommentResponse {
    comments: Comment[];
    page: number;
    size: number;
    hasMore: boolean;
}

export interface PostListResponse {
    posts: PostResponse[];
    page: number;
    size: number;
    hasMore: boolean;
}

// ✅ NOUVEAU : Réponse d'un bookmark
export interface BookmarkResponse {
    id: string;
    userId: string;
    postId: string;
    createdAt: string;
}

// ✅ NOUVEAU : Liste des posts bookmarkés
export interface BookmarkedPostsResponse {
    posts: PostResponse[];
    page: number;
    size: number;
    hasMore: boolean;
    totalBookmarks: number;
}