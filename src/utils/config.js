/**
 * Configuration utility for Vendura application
 *
 * This module provides functions to access environment variables and runtime configuration
 */

/**
 * Get an environment variable from import.meta.env
 * @param {string} key - The environment variable key
 * @param {*} defaultValue - Default value if the key is not found
 * @returns {*} The environment variable value or default value
 */
export const getEnvVar = (key, defaultValue = undefined) => {
  const value = import.meta.env[key];
  return value !== undefined ? value : defaultValue;
};

/**
 * Get the current environment (development, staging, production)
 * @returns {string} The current environment
 */
export const getEnvironment = () => {
  return getEnvVar('VITE_ENV', 'development');
};

/**
 * Check if the current environment is production
 * @returns {boolean} True if the environment is production
 */
export const isProduction = () => {
  return getEnvironment() === 'production';
};

/**
 * Check if the current environment is development
 * @returns {boolean} True if the environment is development
 */
export const isDevelopment = () => {
  return getEnvironment() === 'development';
};

/**
 * Check if the current environment is staging
 * @returns {boolean} True if the environment is staging
 */
export const isStaging = () => {
  return getEnvironment() === 'staging';
};

/**
 * Get the API URL from environment variables
 * @returns {string} The API URL
 */
export const getApiUrl = () => {
  return getEnvVar('VITE_API_URL', 'https://api.vendura.me');
};

/**
 * Load runtime configuration from runtime-config.json
 * This is useful for deployments where environment variables might change
 * without rebuilding the application
 * @returns {Promise<Object>} The runtime configuration
 */
export const loadRuntimeConfig = async () => {
  try {
    const response = await fetch('/runtime-config.json');
    if (!response.ok) {
      console.warn('Failed to load runtime configuration, using environment variables');
      return {};
    }
    return await response.json();
  } catch (error) {
    console.warn('Failed to load runtime configuration, using environment variables', error);
    return {};
  }
};

/**
 * Apply runtime configuration by overriding import.meta.env values
 * @returns {Promise<void>}
 */
export const applyRuntimeConfig = async () => {
  const runtimeConfig = await loadRuntimeConfig();

  // Override import.meta.env with runtime configuration
  Object.entries(runtimeConfig).forEach(([key, value]) => {
    import.meta.env[key] = value;
  });
};

export default {
  getEnvVar,
  getEnvironment,
  isProduction,
  isDevelopment,
  isStaging,
  getApiUrl,
  loadRuntimeConfig,
  applyRuntimeConfig,
};
