import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

import { AuthService, UserService } from '../services';

const AuthContext = createContext();

/**
 * Provider component for authentication state management
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoized loadUser function for useEffect dependency
  const loadUser = useCallback(async () => {
    if (AuthService.isLoggedIn()) {
      try {
        const userData = await UserService.getCurrentUserProfile();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user profile:', error);
        AuthService.logout(); // Logout if profile fetch fails
        setUser(null); // Clear user state
      }
    }
    setLoading(false);
  }, []); // Empty dependency array: runs once on mount

  useEffect(() => {
    loadUser();
  }, [loadUser]); // Depend on the memoized loadUser

  /**
   * Login handler
   * @param {string} username - Username
   * @param {string} password - Password
   */
  const login = useCallback(async (username, password) => {
    const response = await AuthService.login(username, password);
    const userData = await UserService.getCurrentUserProfile();
    setUser(userData);
    return response;
  }, []); // Depends only on static services

  /**
   * Logout handler
   */
  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
  }, []); // No dependencies

  /**
   * Check if current user has specified role
   * @param {string} role - Role to check
   * @returns {boolean} True if user has role
   */
  // No user state dependency needed, relies on AuthService
  const hasRole = useCallback(role => {
    return AuthService.hasRole(role);
  }, []); // No dependencies

  /**
   * Check if current user is admin
   * @returns {boolean} True if user is admin
   */
  // No user state dependency needed, relies on AuthService
  const isAdmin = useCallback(() => {
    return AuthService.isAdmin();
  }, []); // No dependencies

  // Memoize isLoggedIn for consistency, though impact might be small
  const isLoggedIn = useCallback(() => {
    return AuthService.isLoggedIn();
  }, []); // No dependencies

  // Memoized function to refresh user profile
  const refreshUserProfile = useCallback(async () => {
    if (AuthService.isLoggedIn()) {
      // Check login status first
      try {
        const userData = await UserService.getCurrentUserProfile();
        setUser(userData);
      } catch (error) {
        console.error('Failed to refresh user profile:', error);
        AuthService.logout(); // Logout if refresh fails (e.g., token expired)
        setUser(null);
      }
    }
  }, []); // Depends only on static services

  const value = {
    user,
    loading,
    login,
    logout,
    isLoggedIn, // Use memoized version
    hasRole,
    isAdmin,
    refreshUserProfile,
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
