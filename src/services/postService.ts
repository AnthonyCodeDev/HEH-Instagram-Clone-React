import { PostResponse, PostListResponse, CommentResponse } from '../types/post';

const API_URL = 'http://localhost:8081';

export const postService = {
    async getPostById(postId: string): Promise<PostResponse> {
        try {
            const response = await fetch(`${API_URL}/posts/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch post: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching post:', error);
            throw error;
        }
    },

    async getPostComments(postId: string, page = 0, size = 20): Promise<CommentResponse> {
        try {
            const response = await fetch(`${API_URL}/posts/${postId}/comments?page=${page}&size=${size}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch comments: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },

    async likePost(postId: string): Promise<void> {
        try {
            await fetch(`${API_URL}/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error('Error liking post:', error);
            throw error;
        }
    },

    async unlikePost(postId: string): Promise<void> {
        try {
            await fetch(`${API_URL}/posts/${postId}/like`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error('Error unliking post:', error);
            throw error;
        }
    },

    async addComment(postId: string, content: string): Promise<CommentResponse> {
        try {
            const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content })
            });
            if (!response.ok) {
                throw new Error(`Failed to add comment: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    },

    async deletePost(postId: string): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to delete post: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    }
};