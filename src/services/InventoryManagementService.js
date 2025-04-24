import { getUserFriendlyErrorMessage } from '../utils/errorUtils';

import apiClient from './ApiConfig';

/**
 * Service for inventory management operations
 */
class InventoryManagementService {
  constructor() {
    // Cache for inventory data
    this.cache = {
      inventoryStatus: {
        data: null,
        timestamp: null,
      },
    };

    // Cache configuration
    this.cacheConfig = {
      maxAge: 5 * 60 * 1000, // 5 minutes cache time (same as dashboard)
      storageKey: 'vendura_inventory_cache', // Key for localStorage
    };

    // Load cache from localStorage on service initialization
    this.loadCacheFromStorage();
  }

  /**
   * Saves the current cache to localStorage
   */
  saveCacheToStorage() {
    try {
      // Create a copy of the cache object
      const cacheToSave = {
        inventoryStatus: this.cache.inventoryStatus,
      };

      // Store the complete cache in localStorage
      localStorage.setItem(this.cacheConfig.storageKey, JSON.stringify(cacheToSave));
    } catch (error) {
      console.error('Error saving inventory cache to localStorage:', error);
      // Skip localStorage storage on errors, but continue
    }
  }

  /**
   * Loads the cache from localStorage
   */
  loadCacheFromStorage() {
    try {
      const savedCache = localStorage.getItem(this.cacheConfig.storageKey);

      if (savedCache) {
        const parsedCache = JSON.parse(savedCache);

        // Check if the cache entry for inventoryStatus is still valid
        if (
          parsedCache.inventoryStatus &&
          parsedCache.inventoryStatus.data &&
          parsedCache.inventoryStatus.timestamp &&
          this.isCacheValid(parsedCache.inventoryStatus)
        ) {
          // Ensure we load the complete dataset including data
          this.cache.inventoryStatus = parsedCache.inventoryStatus;
          console.log('Cached inventory status data loaded from localStorage');
        }
      }
    } catch (error) {
      console.error('Error loading inventory cache from localStorage:', error);
      // Use in-memory cache on errors
    }
  }

  /**
   * Checks if a cache entry is still valid
   * @param {Object} cacheEntry - The cache entry with data and timestamp
   * @returns {boolean} True if the cache is still valid, false otherwise
   */
  isCacheValid(cacheEntry) {
    // Check if the cache entry exists and has all required fields
    if (!cacheEntry || !cacheEntry.timestamp || !cacheEntry.data) {
      return false;
    }

    // Check if the cache has not expired yet
    const now = Date.now();
    return now - cacheEntry.timestamp < this.cacheConfig.maxAge;
  }

  /**
   * Invalidates relevant caches after data changes
   */
  invalidateCache() {
    this.cache.inventoryStatus = { data: null, timestamp: null };

    // Update cache in localStorage
    this.saveCacheToStorage();
  }

  /**
   * Get inventory status summary for dashboard
   * @param {boolean} forceRefresh - If true, the cache will be ignored
   * @returns {Promise} Promise resolving to inventory status data
   */
  async getInventoryStatus(forceRefresh = false) {
    try {
      // Check cache validity
      const cacheEntry = this.cache.inventoryStatus;

      if (!forceRefresh && this.isCacheValid(cacheEntry)) {
        // Return an object that includes both the data and information
        // that the data comes from the cache
        return {
          data: cacheEntry.data,
          isFromCache: true,
        };
      }

      // If no valid cache, get data from server
      const response = await apiClient.get('/v1/inventory/status');

      // Update the cache
      this.cache.inventoryStatus = {
        data: response.data,
        timestamp: Date.now(),
      };

      // Update cache in localStorage
      this.saveCacheToStorage();

      // Return an object that includes the information that the data is not from cache
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
   * Get products with low stock
   * @returns {Promise} Promise resolving to low stock products data
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
   * Adjust stock level for a product
   * @param {String} productId - Product ID
   * @param {Number} quantity - Quantity to adjust (positive or negative)
   * @param {String} reason - Reason for adjustment
   * @returns {Promise} Promise resolving to adjustment result
   */
  async adjustStock(productId, quantity, reason) {
    try {
      const params = { quantity };
      if (reason) params.reason = reason;
      const response = await apiClient.post(`/v1/inventory/${productId}/adjust`, null, { params });

      // Invalidate cache after successful stock adjustment
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
   * Trigger automatic reordering check
   * @returns {Promise}
   */
  async triggerReorderCheck() {
    try {
      const response = await apiClient.post('/v1/inventory/reorder-check');

      // Invalidate cache after successful reorder check
      this.invalidateCache();

      return response.data;
    } catch (error) {
      console.error('Error triggering reorder check:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to trigger reorder check'));
    }
  }

  /**
   * Get pending supplier orders
   * @returns {Promise} Promise resolving to pending orders
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
   * Get supplier orders by status
   * @param {String} status - Order status (PLACED, SHIPPED, DELIVERED, CANCELLED)
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to supplier orders
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
   * Get automatic supplier orders
   * @param {Boolean} isAutomatic - Whether to get automatic or manual orders
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to supplier orders
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
