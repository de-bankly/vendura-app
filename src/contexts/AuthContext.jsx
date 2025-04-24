import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

import { AuthService, UserService } from '../services';

const AuthContext = createContext();

/**
 * Provider component for authentication state management.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (AuthService.isLoggedIn()) {
      try {
        const userData = await UserService.getCurrentUserProfile();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user profile:', error);
        AuthService.logout();
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /**
   * Logs in the user with the provided credentials.
   * @param {string} username - The user's username.
   * @param {string} password - The user's password.
   * @returns {Promise<any>} The response from the AuthService login method.
   */
  const login = useCallback(async (username, password) => {
    const response = await AuthService.login(username, password);
    const userData = await UserService.getCurrentUserProfile();
    setUser(userData);
    return response;
  }, []);

  /**
   * Logs out the current user.
   */
  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
  }, []);

  /**
   * Checks if the current user has a specific role.
   * @param {string} role - The role to check for.
   * @returns {boolean} True if the user has the specified role, false otherwise.
   */
  const hasRole = useCallback(role => {
    return AuthService.hasRole(role);
  }, []);

  /**
   * Checks if the current user is an administrator.
   * @returns {boolean} True if the user is an admin, false otherwise.
   */
  const isAdmin = useCallback(() => {
    return AuthService.isAdmin();
  }, []);

  /**
   * Checks if a user is currently logged in.
   * @returns {boolean} True if a user is logged in, false otherwise.
   */
  const isLoggedIn = useCallback(() => {
    return AuthService.isLoggedIn();
  }, []);

  /**
   * Refreshes the current user's profile data from the server.
   * Logs the user out if the refresh fails (e.g., token expired).
   */
  const refreshUserProfile = useCallback(async () => {
    if (AuthService.isLoggedIn()) {
      try {
        const userData = await UserService.getCurrentUserProfile();
        setUser(userData);
      } catch (error) {
        console.error('Failed to refresh user profile:', error);
        AuthService.logout();
        setUser(null);
      }
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isLoggedIn,
    hasRole,
    isAdmin,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use the authentication context.
 * Provides access to the auth state and functions.
 * @returns {object} The authentication context value.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
