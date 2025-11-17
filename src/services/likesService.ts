const API_URL = 'http://localhost:8081';

export interface LikedPostsResponse {
    posts: any[]; // Type des posts
    page: number;
    size: number;
    hasMore: boolean;
}

export const likesService = {
    /**
     * Récupérer les posts likés de l'utilisateur connecté
     * @param page - Numéro de la page (défaut: 0)
     * @param size - Nombre de posts par page (défaut: 12, max: 100)
     * @returns LikedPostsResponse
     */
    async getLikedPosts(page: number = 0, size: number = 12): Promise<LikedPostsResponse> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log(`[LikesService] Fetching liked posts - page: ${page}, size: ${size}`);
            
            const response = await fetch(`${API_URL}/posts/likes?page=${page}&size=${size}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(`[LikesService] Response status: ${response.status}`);

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unknown error');
                console.error('[LikesService] Error response:', errorText);
                
                if (response.status === 400) {
                    throw new Error('Taille invalide (max 100)');
                }
                if (response.status === 404) {
                    console.warn('[LikesService] ⚠️ Endpoint /likes not found (404) - Backend may not have implemented this endpoint yet. Returning empty list.');
                    return {
                        posts: [],
                        page: 0,
                        size: size,
                        hasMore: false
                    };
                }
                if (response.status === 500) {
                    console.warn('[LikesService] ⚠️ Server error 500 on /likes - Backend may not have implemented this endpoint yet. Returning empty list.');
                    return {
                        posts: [],
                        page: 0,
                        size: size,
                        hasMore: false
                    };
                }
                throw new Error(`Failed to fetch liked posts: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('[LikesService] Liked posts response:', data);
            return data;
        } catch (error) {
            console.error('Error fetching liked posts:', error);
            throw error;
        }
    },

    /**
     * Récupérer le nombre total de likes de l'utilisateur connecté
     * @returns Le nombre total de likes
     */
    async getLikesCount(): Promise<number> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('[LikesService] No token found, returning 0 likes');
                return 0;
            }

            console.log('[LikesService] Fetching likes count');
            
            const response = await fetch(`${API_URL}/posts/likes/count`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(`[LikesService] Count response status: ${response.status}`);

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unknown error');
                
                if (response.status === 500) {
                    console.warn('[LikesService] ⚠️ Server error 500 on /likes/count - Backend may not have implemented this endpoint yet. Returning 0.');
                    return 0;
                }
                if (response.status === 404) {
                    console.warn('[LikesService] ⚠️ Endpoint /likes/count not found (404) - Backend may not have implemented this endpoint yet. Returning 0.');
                    return 0;
                }
                
                console.error(`[LikesService] Failed to fetch count: ${response.status} - ${errorText}`);
                return 0;
            }

            const count = await response.json();
            console.log('[LikesService] Likes count:', count);
            return typeof count === 'number' ? count : 0;
        } catch (error) {
            console.warn('[LikesService] Error fetching likes count (network or parsing issue), returning 0:', error);
            return 0;
        }
    }
};
