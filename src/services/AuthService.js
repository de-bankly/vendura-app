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
      // First check if the server is reachable
      const response = await apiClient.post('/v1/authentication/authenticate', {
        username,
        password,
      });

      if (response.data && response.data.token) {
        // Store the token
        localStorage.setItem('token', response.data.token);

        // If response has roles as array of strings, convert them to objects for consistency
        if (response.data.roles && Array.isArray(response.data.roles)) {
          const user = {
            username: response.data.username,
            roles: response.data.roles.map(role => ({ name: role })),
          };
          localStorage.setItem('user', JSON.stringify(user));
        } else if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }

      return response.data;
    } catch (error) {
      // Log detailed error for debugging
      console.error('Login error:', error);

      // Handle specific network errors
      if (error.message === 'Network Error') {
        throw new Error(
          'Unable to connect to the server. Please check if the server is running and try again.'
        );
      }

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
    // First priority: Check roles directly from JWT token
    const tokenData = this.decodeToken();
    if (tokenData && tokenData.roles) {
      // Spring Security prefixes roles with ROLE_
      const hasRoleInToken = tokenData.roles.some(r => {
        const roleString = String(r); // Ensure it's a string
        return (
          roleString === role ||
          roleString === `ROLE_${role}` ||
          (roleString.startsWith('ROLE_') && roleString.substring(5) === role)
        );
      });

      if (hasRoleInToken) {
        return true;
      }
    }

    // Second priority: Check user from localStorage
    const user = this.getCurrentUser();

    if (!user || !user.roles) {
      return false;
    }

    // Check roles in user object
    const userRoles = user.roles;

    // If roles are strings (direct array of role names)
    if (Array.isArray(userRoles) && typeof userRoles[0] === 'string') {
      const hasRole = userRoles.some(
        r =>
          r === role || r === `ROLE_${role}` || (r.startsWith('ROLE_') && r.substring(5) === role)
      );

      return hasRole;
    }

    // If roles are objects with name property
    const hasRole = userRoles.some(r => {
      const roleName = r.name;
      return (
        roleName === role ||
        roleName === `ROLE_${role}` ||
        (roleName.startsWith('ROLE_') && roleName.substring(5) === role)
      );
    });

    return hasRole;
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
