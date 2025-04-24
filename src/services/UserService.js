import { getUserFriendlyErrorMessage } from '../utils/errorUtils';

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
      console.error('Error fetching user profile:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch user profile'));
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
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch users'));
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
      console.error(`Error fetching user ${id}:`, error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch user details'));
    }
  }

  /**
   * Create a new user (admin only)
   * @param {Object} userData - User data object
   * @returns {Promise} Promise with created user data
   */
  async createUser(userData) {
    try {
      // Create a clean data object with only the fields the API expects
      const cleanedData = {
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        active: userData.active,
        locked: userData.locked,
        roles: Array.isArray(userData.roles)
          ? userData.roles.filter(role => role !== undefined).map(role => String(role))
          : [],
      };

      const response = await apiClient.post('/v1/user', cleanedData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to create user'));
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
      // Create a clean data object with only the fields the API expects
      const cleanedData = {
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        active: userData.active,
        locked: userData.locked,
      };

      // Only include roles if they're explicitly provided
      // This prevents the API from removing roles when they're not specified
      if (userData.roles !== undefined) {
        cleanedData.roles = Array.isArray(userData.roles)
          ? userData.roles.filter(role => role !== undefined).map(role => String(role))
          : [];
      }

      // Only include password if it's provided
      if (userData.password) {
        cleanedData.password = userData.password;
      }

      const response = await apiClient.put(`/v1/user/${id}`, cleanedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to update user'));
    }
  }
}

export default new UserService();
