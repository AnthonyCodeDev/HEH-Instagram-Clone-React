import { UserResponse, SearchUserResponse, PostListResponse, UpdateUserRequest, ChangePasswordRequest } from '../types/user';

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
            const token = localStorage.getItem('token');
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const searchResponse = await fetch(`${API_URL}/users/search?query=${username}`, { headers });

            if (!searchResponse.ok) {
                throw new Error(`Search failed: ${searchResponse.status}`);
            }

            const searchData = await searchResponse.json() as SearchUserResponse;
            console.log(`[userService] Search results:`, searchData);

            // Some backends return `currentUserFollowing` instead of `isCurrentUserFollowing`.
            // Normalize the search items to always expose `isCurrentUserFollowing`.
            const normalizedUsers = searchData.users.map(u => ({
                ...u,
                isCurrentUserFollowing: (u as any).isCurrentUserFollowing ?? (u as any).currentUserFollowing ?? false
            }));

            const matchedUser = normalizedUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
            if (!matchedUser) {
                throw new Error('User not found');
            }

            // Une fois qu'on a l'ID, utilisons l'endpoint /users/{id} qui est garanti public
            console.log(`[userService] Fetching full profile for user ID: ${matchedUser.id}`);
            const profileResponse = await fetch(`${API_URL}/users/${matchedUser.id}`, { headers });

            if (!profileResponse.ok) {
                throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
            }

            const profileData = await profileResponse.json();
            console.log(`[userService] Full profile data:`, profileData);

            // Normalize profile fields: backend may return `currentUserFollowing`.
            const normalizedProfile = {
                ...profileData,
                isCurrentUserFollowing: (profileData as any).isCurrentUserFollowing ?? (profileData as any).currentUserFollowing ?? false
            };

            return normalizedProfile;
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
            // Normaliser le champ de follow pour les consumers frontend
            return (data.users || []).map((u: any) => ({
                ...u,
                isCurrentUserFollowing: u.isCurrentUserFollowing ?? u.currentUserFollowing ?? false
            })); // Retourne le tableau users de la réponse
        } catch (error) {
            console.error('Error fetching random users:', error);
            throw error;
        }
    },

    async updateUser(userData: UpdateUserRequest): Promise<UserResponse> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error(`Failed to update user: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const formData = new FormData();
            formData.append('avatar', file);  // Le backend attend 'avatar' comme nom de champ

            const response = await fetch(`${API_URL}/users/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Ne pas ajouter 'Content-Type' - laissez le navigateur le définir automatiquement pour multipart/form-data
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Avatar upload error response:', errorText);
                throw new Error(`Failed to upload avatar: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw error;
        }
    },

    async uploadBanner(file: File): Promise<{ bannerUrl: string }> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const formData = new FormData();
            formData.append('banner', file);  // Le backend attend 'banner' comme nom de champ

            const response = await fetch(`${API_URL}/users/banner`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Ne pas ajouter 'Content-Type' - laissez le navigateur le définir automatiquement pour multipart/form-data
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Banner upload error response:', errorText);
                throw new Error(`Failed to upload banner: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading banner:', error);
            throw error;
        }
    },

    async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/users/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(passwordData)
            });

            if (!response.ok) {
                throw new Error(`Failed to change password: ${response.status}`);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }
};