import { getUserFriendlyErrorMessage } from '../utils/errorUtils';

import apiClient from './ApiConfig';

/**
 * Service for handling authentication operations
 */
class AuthService {
  /**
   * Login with username and password
   * @param {string} username - The user's username
   * @param {string} password - The user's password
   * @returns {Promise<object>} Promise resolving with the authentication response containing token and user info
   */
  async login(username, password) {
    try {
      const response = await apiClient.post('/v1/authentication/authenticate', {
        username,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);

        let roles = [];
        if (response.data.roles && Array.isArray(response.data.roles)) {
          roles = response.data.roles
            .map(role => (typeof role === 'string' ? { name: role } : role))
            .filter(role => role && role.name);
        } else if (response.data.user && Array.isArray(response.data.user.roles)) {
          roles = response.data.user.roles;
        }
        const user = {
          username: response.data.username,
          ...(response.data.user || {}),
          roles: roles,
        };
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      console.error('Login API error:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Login failed'));
    }
  }

  /**
   * Logout the user by removing token and user info from localStorage
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Get current authenticated user from localStorage
   * @returns {object|null} User object or null if not logged in or data is corrupted
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is logged in based on the presence of a token
   * @returns {boolean} True if a token exists in localStorage, false otherwise
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
   * Decode the JWT token stored in localStorage to inspect its payload
   * @returns {object|null} Decoded token payload object or null if no token exists or decoding fails
   */
  decodeToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const payloadObj = JSON.parse(decodedPayload);

      return payloadObj;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if the currently logged-in user has a specific role
   * @param {string} role - The role name to check for (e.g., 'ADMIN', 'USER')
   * @returns {boolean} True if the user has the specified role, false otherwise
   */
  hasRole(role) {
    const user = this.getCurrentUser();

    if (!user || !Array.isArray(user.roles)) {
      return false;
    }

    const hasRoleInUser = user.roles.some(r => {
      const roleName = r.name || r;
      if (typeof roleName !== 'string') return false;
      // Check for exact match, ROLE_ prefix match, or match without ROLE_ prefix
      return (
        roleName === role ||
        roleName === `ROLE_${role}` ||
        (roleName.startsWith('ROLE_') && roleName.substring(5) === role)
      );
    });

    return hasRoleInUser;
  }

  /**
   * Check if the currently logged-in user is an administrator
   * @returns {boolean} True if the user has the 'ADMIN' role, false otherwise
   */
  isAdmin() {
    return this.hasRole('ADMIN');
  }
}

export default new AuthService();
