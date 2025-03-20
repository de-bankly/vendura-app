/**
 * Service Worker registration utility for Vendura application
 *
 * This module provides functions to register and manage the service worker
 */

import { registerSW } from 'virtual:pwa-register';
import { isProduction } from './config';

/**
 * Register the service worker
 * @returns {Function} A function to update the service worker
 */
export const registerServiceWorker = () => {
  // Only register in production or if explicitly enabled in development
  if (!isProduction() && !import.meta.env.VITE_ENABLE_SW) {
    console.log('Service Worker registration skipped in development mode');
    return null;
  }

  // Register the service worker with auto-update
  const updateSW = registerSW({
    onNeedRefresh() {
      // Show a notification to the user that there's an update available
      const shouldUpdate = window.confirm(
        'A new version of the application is available. Update now?'
      );

      if (shouldUpdate) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log('App is ready for offline use');
    },
    onRegistered(registration) {
      console.log('Service Worker registered:', registration);
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error);
    },
  });

  return updateSW;
};

export default registerServiceWorker;
