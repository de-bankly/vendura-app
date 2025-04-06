import apiClient from './ApiConfig';

/**
 * Service for handling role operations (admin only)
 */
class RoleService {
  /**
   * Get all roles with pagination
   * @param {number} page - Page number for pagination
   * @param {number} size - Number of items per page
   * @returns {Promise} Promise with role data page
   */
  async getAllRoles(page = 0, size = 10) {
    try {
      const response = await apiClient.get('/v1/role', {
        params: {
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  /**
   * Get role by ID
   * @param {string} id - Role ID to fetch
   * @returns {Promise} Promise with role data
   */
  async getRoleById(id) {
    try {
      const response = await apiClient.get(`/v1/role/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching role ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new role
   * @param {Object} roleData - Role data object
   * @returns {Promise} Promise with created role data
   */
  async createRole(roleData) {
    try {
      const response = await apiClient.post('/v1/role', roleData);
      return response.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  /**
   * Update a role
   * @param {string} id - Role ID to update
   * @param {Object} roleData - Updated role data
   * @returns {Promise} Promise with updated role data
   */
  async updateRole(id, roleData) {
    try {
      const response = await apiClient.put(`/v1/role/${id}`, roleData);
      return response.data;
    } catch (error) {
      console.error(`Error updating role ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deactivate a role
   * @param {string} id - Role ID to deactivate
   * @returns {Promise} Promise with deactivated role data
   */
  async deactivateRole(id) {
    try {
      const response = await apiClient.delete(`/v1/role/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deactivating role ${id}:`, error);
      throw error;
    }
  }
}

export default new RoleService();
