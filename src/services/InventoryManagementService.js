import { getUserFriendlyErrorMessage } from '../utils/errorUtils';

import apiClient from './ApiConfig';

/**
 * Service for inventory management operations, including caching.
 */
class InventoryManagementService {
  /**
   * Initializes the service, sets up cache configuration, and loads cache from storage.
   */
  constructor() {
    this.cache = {
      inventoryStatus: {
        data: null,
        timestamp: null,
      },
    };

    this.cacheConfig = {
      maxAge: 5 * 60 * 1000, // 5 minutes
      storageKey: 'vendura_inventory_cache',
    };

    this.loadCacheFromStorage();
  }

  /**
   * Saves the current inventory status cache to localStorage.
   * Handles potential storage errors gracefully.
   */
  saveCacheToStorage() {
    try {
      const cacheToSave = {
        inventoryStatus: this.cache.inventoryStatus,
      };
      localStorage.setItem(this.cacheConfig.storageKey, JSON.stringify(cacheToSave));
    } catch (error) {
      console.error('Error saving inventory cache to localStorage:', error);
    }
  }

  /**
   * Loads the inventory status cache from localStorage if available and valid.
   * Handles potential parsing or storage errors.
   */
  loadCacheFromStorage() {
    try {
      const savedCache = localStorage.getItem(this.cacheConfig.storageKey);
      if (savedCache) {
        const parsedCache = JSON.parse(savedCache);
        if (parsedCache.inventoryStatus && this.isCacheValid(parsedCache.inventoryStatus)) {
          this.cache.inventoryStatus = parsedCache.inventoryStatus;
          console.log('Cached inventory status data loaded from localStorage');
        }
      }
    } catch (error) {
      console.error('Error loading inventory cache from localStorage:', error);
    }
  }

  /**
   * Checks if a cache entry is still valid based on its timestamp and the configured maxAge.
   * @param {Object} cacheEntry - The cache entry containing data and timestamp.
   * @param {any} cacheEntry.data - The cached data.
   * @param {number} cacheEntry.timestamp - The timestamp when the data was cached.
   * @returns {boolean} True if the cache entry is valid, false otherwise.
   */
  isCacheValid(cacheEntry) {
    if (!cacheEntry || !cacheEntry.timestamp || !cacheEntry.data) {
      return false;
    }
    const now = Date.now();
    return now - cacheEntry.timestamp < this.cacheConfig.maxAge;
  }

  /**
   * Invalidates the inventory status cache by clearing its data and timestamp,
   * and updates the cache in localStorage.
   */
  invalidateCache() {
    this.cache.inventoryStatus = { data: null, timestamp: null };
    this.saveCacheToStorage();
  }

  /**
   * Gets the inventory status summary. Returns cached data if available and valid,
   * otherwise fetches fresh data from the API and updates the cache.
   * @param {boolean} [forceRefresh=false] - If true, ignores the cache and fetches fresh data.
   * @returns {Promise<Object>} A promise resolving to an object containing the inventory status data
   *                            and a flag indicating if the data is from the cache.
   * @throws {Error} If fetching data from the API fails.
   */
  async getInventoryStatus(forceRefresh = false) {
    const cacheEntry = this.cache.inventoryStatus;

    if (!forceRefresh && this.isCacheValid(cacheEntry)) {
      return {
        data: cacheEntry.data,
        isFromCache: true,
      };
    }

    try {
      const response = await apiClient.get('/v1/inventory/status');
      this.cache.inventoryStatus = {
        data: response.data,
        timestamp: Date.now(),
      };
      this.saveCacheToStorage();
      return {
        data: response.data,
        isFromCache: false,
      };
    } catch (error) {
      console.error('Error fetching inventory status:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch inventory status'));
    }
  }

  /**
   * Gets a list of products with low stock levels.
   * @returns {Promise<Array<Object>>} A promise resolving to an array of low stock product data.
   * @throws {Error} If fetching data from the API fails.
   */
  async getLowStockProducts() {
    try {
      const response = await apiClient.get('/v1/inventory/low-stock');
      return response.data;
    } catch (error) {
      console.error('Error fetching low stock products:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch low stock products'));
    }
  }

  /**
   * Adjusts the stock level for a specific product. Invalidates the cache upon success.
   * @param {string} productId - The ID of the product to adjust.
   * @param {number} quantity - The quantity to adjust by (can be positive or negative).
   * @param {string} [reason] - An optional reason for the stock adjustment.
   * @returns {Promise<Object>} A promise resolving to the result of the stock adjustment.
   * @throws {Error} If the API call fails.
   */
  async adjustStock(productId, quantity, reason) {
    try {
      const params = { quantity };
      if (reason) params.reason = reason;
      const response = await apiClient.post(`/v1/inventory/${productId}/adjust`, null, { params });
      this.invalidateCache();
      return response.data;
    } catch (error) {
      console.error(
        `Error adjusting stock for product ${productId}:`,
        error.response || error.message
      );
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to adjust stock'));
    }
  }

  /**
   * Triggers an automatic reordering check process on the server. Invalidates the cache upon success.
   * @returns {Promise<Object>} A promise resolving to the result of the reorder check trigger.
   * @throws {Error} If the API call fails.
   */
  async triggerReorderCheck() {
    try {
      const response = await apiClient.post('/v1/inventory/reorder-check');
      this.invalidateCache();
      return response.data;
    } catch (error) {
      console.error('Error triggering reorder check:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to trigger reorder check'));
    }
  }

  /**
   * Gets a list of pending supplier orders.
   * @returns {Promise<Array<Object>>} A promise resolving to an array of pending supplier order data.
   * @throws {Error} If fetching data from the API fails.
   */
  async getPendingSupplierOrders() {
    try {
      const response = await apiClient.get('/v1/supplierorder/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending supplier orders:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch pending orders'));
    }
  }

  /**
   * Gets supplier orders filtered by status, with pagination.
   * @param {string} status - The status to filter by (e.g., 'PLACED', 'SHIPPED').
   * @param {Object} [pageable={ page: 0, size: 10 }] - Pagination parameters.
   * @param {number} pageable.page - The page number (0-indexed).
   * @param {number} pageable.size - The number of items per page.
   * @returns {Promise<Object>} A promise resolving to a page of supplier order data.
   * @throws {Error} If fetching data from the API fails.
   */
  async getSupplierOrdersByStatus(status, pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get(`/v1/supplierorder/status/${status}`, {
        params: pageable,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching supplier orders with status ${status}:`,
        error.response || error.message
      );
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch supplier orders'));
    }
  }

  /**
   * Gets supplier orders filtered by whether they were created automatically or manually, with pagination.
   * @param {boolean} isAutomatic - True to fetch automatic orders, false for manual orders.
   * @param {Object} [pageable={ page: 0, size: 10 }] - Pagination parameters.
   * @param {number} pageable.page - The page number (0-indexed).
   * @param {number} pageable.size - The number of items per page.
   * @returns {Promise<Object>} A promise resolving to a page of supplier order data.
   * @throws {Error} If fetching data from the API fails.
   */
  async getAutomaticSupplierOrders(isAutomatic, pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get(`/v1/supplierorder/automatic/${isAutomatic}`, {
        params: pageable,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching ${isAutomatic ? 'automatic' : 'manual'} supplier orders:`,
        error.response || error.message
      );
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch supplier orders'));
    }
  }
}

export default new InventoryManagementService();
