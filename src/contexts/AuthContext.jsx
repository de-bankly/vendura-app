import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthService, UserService } from '../services';

const AuthContext = createContext();

/**
 * Provider component for authentication state management
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on initial load
    const loadUser = async () => {
      if (AuthService.isLoggedIn()) {
        try {
          const userData = await UserService.getCurrentUserProfile();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user profile:', error);
          // If token is invalid, logout
          AuthService.logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  /**
   * Login handler
   * @param {string} username - Username
   * @param {string} password - Password
   */
  const login = async (username, password) => {
    const response = await AuthService.login(username, password);

    // Fetch current user profile after login
    const userData = await UserService.getCurrentUserProfile();
    setUser(userData);

    return response;
  };

  /**
   * Logout handler
   */
  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  /**
   * Check if current user has specified role
   * @param {string} role - Role to check
   * @returns {boolean} True if user has role
   */
  const hasRole = role => {
    return AuthService.hasRole(role);
  };

  /**
   * Check if current user is admin
   * @returns {boolean} True if user is admin
   */
  const isAdmin = () => {
    return AuthService.isAdmin();
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isLoggedIn: AuthService.isLoggedIn,
    hasRole,
    isAdmin,
    refreshUserProfile: async () => {
      if (AuthService.isLoggedIn()) {
        const userData = await UserService.getCurrentUserProfile();
        setUser(userData);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use the auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
