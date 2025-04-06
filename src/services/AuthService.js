import apiClient from './ApiConfig';

/**
 * Service for handling authentication operations
 */
class AuthService {
  /**
   * Login with username and password
   * @param {string} username - The user's username
   * @param {string} password - The user's password
   * @returns {Promise} Promise with auth response containing token and user info
   */
  async login(username, password) {
    try {
      const response = await apiClient.post('/v1/authentication/authenticate', {
        username,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout the user by removing token and user info
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Get current authenticated user
   * @returns {Object|null} User object or null if not logged in
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is logged in
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
   * Check if user has a specific role
   * @param {string} role - Role name to check
   * @returns {boolean} True if user has the role
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    if (!user || !user.roles) {
      return false;
    }
    return user.roles.some(r => r.name === role);
  }

  /**
   * Check if user is an admin
   * @returns {boolean} True if user is an admin
   */
  isAdmin() {
    return this.hasRole('ADMIN');
  }
}

export default new AuthService();
