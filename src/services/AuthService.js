import apiClient from './ApiConfig';
import { getUserFriendlyErrorMessage } from '../utils/errorUtils';

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
        // Ensure roles are stored consistently as array of objects with name
        let roles = [];
        if (response.data.roles && Array.isArray(response.data.roles)) {
          roles = response.data.roles
            .map(role => (typeof role === 'string' ? { name: role } : role))
            .filter(role => role && role.name); // Ensure valid objects
        } else if (response.data.user && Array.isArray(response.data.user.roles)) {
          roles = response.data.user.roles;
        }
        const user = {
          username: response.data.username,
          // Add other relevant user details if available in response.data.user
          ...(response.data.user || {}),
          roles: roles, // Store consistent roles array
        };
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      console.error('Login API error:', error.response || error.message);
      // Use utility to throw a more user-friendly error
      throw new Error(getUserFriendlyErrorMessage(error, 'Login failed'));
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
   * Decode JWT token to inspect payload (for debugging)
   * @returns {Object|null} Decoded token payload or null
   */
  decodeToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      // JWT tokens consist of three parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      // The payload is the second part, base64 encoded
      const payload = parts[1];

      // Decode the base64 payload
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

      // Parse the JSON payload
      const payloadObj = JSON.parse(decodedPayload);

      return payloadObj;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if user has a specific role
   * @param {string} role - Role name to check
   * @returns {boolean} True if user has the role
   */
  hasRole(role) {
    // Rely primarily on user object from localStorage for consistency
    const user = this.getCurrentUser();

    if (!user || !Array.isArray(user.roles)) {
      return false;
    }

    // Check roles in user object (assuming consistent format: { name: 'ROLE_XYZ' } or { name: 'XYZ' })
    const hasRoleInUser = user.roles.some(r => {
      const roleName = r.name || r; // Handle both object and string format defensively
      if (typeof roleName !== 'string') return false;
      return (
        roleName === role ||
        roleName === `ROLE_${role}` ||
        (roleName.startsWith('ROLE_') && roleName.substring(5) === role)
      );
    });

    return hasRoleInUser;
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
