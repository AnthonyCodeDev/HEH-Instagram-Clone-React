import type { BookmarkResponse, BookmarkedPostsResponse } from '../types/post';

const API_URL = 'http://localhost:8081';

export const bookmarkService = {
    /**
     * Enregistrer un post (bookmark)
     * @param postId - UUID du post à enregistrer
     * @returns BookmarkResponse
     */
    async bookmarkPost(postId: string): Promise<BookmarkResponse> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/posts/${postId}/bookmark`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error('Post déjà enregistré');
                }
                if (response.status === 404) {
                    throw new Error('Post non trouvé');
                }
                throw new Error(`Failed to bookmark post: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error bookmarking post:', error);
            throw error;
        }
    },

    /**
     * Retirer un post des enregistrements (unbookmark)
     * @param postId - UUID du post à retirer
     */
    async unbookmarkPost(postId: string): Promise<void> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/posts/${postId}/bookmark`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Bookmark non trouvé');
                }
                throw new Error(`Failed to unbookmark post: ${response.status}`);
            }
        } catch (error) {
            console.error('Error unbookmarking post:', error);
            throw error;
        }
    },

    /**
     * Récupérer les posts enregistrés de l'utilisateur connecté
     * @param page - Numéro de la page (défaut: 0)
     * @param size - Nombre de posts par page (défaut: 12, max: 100)
     * @returns BookmarkedPostsResponse
     */
    async getBookmarkedPosts(page: number = 0, size: number = 12): Promise<BookmarkedPostsResponse> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log(`[BookmarkService] Fetching bookmarked posts - page: ${page}, size: ${size}`);
            
            const response = await fetch(`${API_URL}/posts/bookmarks?page=${page}&size=${size}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(`[BookmarkService] Response status: ${response.status}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[BookmarkService] Error response:', errorText);
                
                if (response.status === 400) {
                    throw new Error('Taille invalide (max 100)');
                }
                if (response.status === 404) {
                    // L'endpoint n'existe peut-être pas, retourner une liste vide
                    console.warn('[BookmarkService] Endpoint not found, returning empty list');
                    return {
                        posts: [],
                        page: 0,
                        size: size,
                        hasMore: false,
                        totalBookmarks: 0
                    };
                }
                if (response.status === 500) {
                    // Erreur serveur, retourner une liste vide pour ne pas casser l'UI
                    console.error('[BookmarkService] Server error 500, returning empty list. Backend needs to fix GET /posts/bookmarks endpoint');
                    return {
                        posts: [],
                        page: 0,
                        size: size,
                        hasMore: false,
                        totalBookmarks: 0
                    };
                }
                throw new Error(`Failed to fetch bookmarked posts: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('[BookmarkService] Bookmarked posts response:', data);
            return data;
        } catch (error) {
            console.error('Error fetching bookmarked posts:', error);
            throw error;
        }
    },

    /**
     * Récupérer le nombre total de bookmarks de l'utilisateur connecté
     * @returns Le nombre total de bookmarks
     */
    async getBookmarksCount(): Promise<number> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log('[BookmarkService] Fetching bookmarks count');
            
            const response = await fetch(`${API_URL}/posts/bookmarks/count`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(`[BookmarkService] Count response status: ${response.status}`);

            if (!response.ok) {
                console.error('[BookmarkService] Failed to fetch count');
                return 0; // Retourner 0 en cas d'erreur
            }

            const count = await response.json();
            console.log('[BookmarkService] Bookmarks count:', count);
            return typeof count === 'number' ? count : 0;
        } catch (error) {
            console.error('Error fetching bookmarks count:', error);
            return 0;
        }
    }
};
