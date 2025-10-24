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
    likedByCurrentUser: boolean;
    favoritedByCurrentUser: boolean;
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