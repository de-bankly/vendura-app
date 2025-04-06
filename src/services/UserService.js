import apiClient from './ApiConfig';

/**
 * Service for handling user operations
 */
class UserService {
  /**
   * Get current user profile information
   * @returns {Promise} Promise with user data
   */
  async getCurrentUserProfile() {
    try {
      const response = await apiClient.get('/v1/user/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Get all users (admin only)
   * @param {number} page - Page number for pagination
   * @param {number} size - Number of items per page
   * @returns {Promise} Promise with user data page
   */
  async getAllUsers(page = 0, size = 10) {
    try {
      const response = await apiClient.get('/v1/user', {
        params: {
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID (admin only)
   * @param {string} id - User ID to fetch
   * @returns {Promise} Promise with user data
   */
  async getUserById(id) {
    try {
      const response = await apiClient.get(`/v1/user/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user (admin only)
   * @param {Object} userData - User data object
   * @returns {Promise} Promise with created user data
   */
  async createUser(userData) {
    try {
      const response = await apiClient.post('/v1/user', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update a user (admin only)
   * @param {string} id - User ID to update
   * @param {Object} userData - Updated user data
   * @returns {Promise} Promise with updated user data
   */
  async updateUser(id, userData) {
    try {
      const response = await apiClient.put(`/v1/user/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }
}

export default new UserService();
