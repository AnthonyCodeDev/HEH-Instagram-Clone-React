import type { FollowersResponse, FollowingResponse } from '@/types/follow';

const API_URL = 'http://localhost:8081';

export const followService = {
  /**
   * Récupérer la liste des abonnés (followers) d'un utilisateur
   * @param userId - UUID de l'utilisateur
   * @param page - Numéro de page (défaut: 0)
   * @param size - Nombre de résultats par page (défaut: 20)
   * @returns FollowersResponse
   */
  async getFollowers(userId: string, page: number = 0, size: number = 20): Promise<FollowersResponse> {
    try {
      const token = localStorage.getItem('token');
      
      console.log(`[FollowService] Fetching followers for user ${userId} - page: ${page}, size: ${size}`);
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(
        `${API_URL}/users/${userId}/followers?page=${page}&size=${size}`,
        { headers }
      );

      console.log(`[FollowService] Followers response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch followers: ${response.status}`);
      }

      const data = await response.json();
      console.log('[FollowService] Followers data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching followers:', error);
      throw error;
    }
  },

  /**
   * Récupérer la liste des abonnements (following) d'un utilisateur
   * @param userId - UUID de l'utilisateur
   * @param page - Numéro de page (défaut: 0)
   * @param size - Nombre de résultats par page (défaut: 20)
   * @returns FollowingResponse
   */
  async getFollowing(userId: string, page: number = 0, size: number = 20): Promise<FollowingResponse> {
    try {
      const token = localStorage.getItem('token');
      
      console.log(`[FollowService] Fetching following for user ${userId} - page: ${page}, size: ${size}`);
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(
        `${API_URL}/users/${userId}/following?page=${page}&size=${size}`,
        { headers }
      );

      console.log(`[FollowService] Following response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch following: ${response.status}`);
      }

      const data = await response.json();
      console.log('[FollowService] Following data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching following:', error);
      throw error;
    }
  }
};
