import { UserResponse, SearchUserResponse, PostListResponse } from '../types/user';

const API_URL = 'http://localhost:8081';

export const userService = {
    async getCurrentUser(): Promise<UserResponse | null> {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const response = await fetch(`${API_URL}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch current user');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching current user:', error);
            return null;
        }
    },

    async getUserByUsername(username: string): Promise<UserResponse> {
        try {
            // D'abord, cherchons avec l'endpoint de recherche public garanti
            console.log(`[userService] Searching for user "${username}" via search endpoint`);
            const searchResponse = await fetch(`${API_URL}/users/search?query=${username}`);

            if (!searchResponse.ok) {
                throw new Error(`Search failed: ${searchResponse.status}`);
            }

            const searchData = await searchResponse.json() as SearchUserResponse;
            console.log(`[userService] Search results:`, searchData);

            const matchedUser = searchData.users.find(u => u.username.toLowerCase() === username.toLowerCase());
            if (!matchedUser) {
                throw new Error('User not found');
            }

            // Une fois qu'on a l'ID, utilisons l'endpoint /users/{id} qui est garanti public
            console.log(`[userService] Fetching full profile for user ID: ${matchedUser.id}`);
            const profileResponse = await fetch(`${API_URL}/users/${matchedUser.id}`);

            if (!profileResponse.ok) {
                throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
            }

            const profileData = await profileResponse.json();
            console.log(`[userService] Full profile data:`, profileData);
            return profileData;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    async getUserPosts(userId: string, page = 0, size = 20): Promise<PostListResponse> {
        try {
            const response = await fetch(`${API_URL}/posts/user/${userId}?page=${page}&size=${size}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching user posts:', error);
            throw error;
        }
    },

    async followUser(userId: string): Promise<void> {
        try {
            await fetch(`${API_URL}/users/${userId}/follow`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error('Error following user:', error);
            throw error;
        }
    },

    async unfollowUser(userId: string): Promise<void> {
        try {
            await fetch(`${API_URL}/users/${userId}/follow`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error('Error unfollowing user:', error);
            throw error;
        }
    },

    async getRandomUsers(size: number = 6): Promise<UserResponse[]> {
        try {
            const response = await fetch(`${API_URL}/users/random?size=${size}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch random users: ${response.status}`);
            }

            const data = await response.json();
            return data.users; // Retourne le tableau users de la réponse
        } catch (error) {
            console.error('Error fetching random users:', error);
            throw error;
        }
    }
};