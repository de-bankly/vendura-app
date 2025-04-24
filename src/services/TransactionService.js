import apiClient from './ApiConfig';

/**
 * Service for managing sales transactions, including caching logic.
 */
class TransactionService {
  /**
   * Initializes the service, sets up cache configuration, and loads
   * any existing cache from localStorage.
   */
  constructor() {
    this.cache = {
      latestSales: {
        data: null,
        timestamp: null,
        params: null,
      },
      saleDetails: {},
      productTransactions: {},
    };

    this.cacheConfig = {
      maxAge: 2 * 60 * 1000, // Default cache age: 2 minutes
      dashboardMaxAge: 5 * 60 * 1000, // Dashboard cache age: 5 minutes
      storageKey: 'vendura_transaction_cache', // localStorage key
    };

    this.loadCacheFromStorage();
  }

  /**
   * Saves the current state of the cache to localStorage.
   */
  saveCacheToStorage() {
    try {
      const cacheToSave = {
        latestSales: this.cache.latestSales,
        saleDetails: Object.fromEntries(
          Object.entries(this.cache.saleDetails).map(([id, entry]) => [
            id,
            {
              data: entry.data,
              timestamp: entry.timestamp,
            },
          ])
        ),
        productTransactions: Object.fromEntries(
          Object.entries(this.cache.productTransactions).map(([id, entry]) => [
            id,
            {
              data: entry.data,
              timestamp: entry.timestamp,
              params: entry.params,
            },
          ])
        ),
      };

      localStorage.setItem(this.cacheConfig.storageKey, JSON.stringify(cacheToSave));
    } catch (error) {
      console.error('Error saving cache to localStorage:', error);
    }
  }

  /**
   * Loads the cache state from localStorage upon service initialization.
   * Only loads valid (non-expired) cache entries.
   */
  loadCacheFromStorage() {
    try {
      const savedCache = localStorage.getItem(this.cacheConfig.storageKey);

      if (savedCache) {
        const parsedCache = JSON.parse(savedCache);

        if (
          parsedCache.latestSales &&
          parsedCache.latestSales.data &&
          parsedCache.latestSales.timestamp &&
          this.isCacheValid(parsedCache.latestSales)
        ) {
          this.cache.latestSales = parsedCache.latestSales;
        }

        if (parsedCache.saleDetails) {
          const validSaleDetails = {};
          Object.entries(parsedCache.saleDetails).forEach(([id, entry]) => {
            if (entry.timestamp && entry.data && this.isCacheValid(entry)) {
              validSaleDetails[id] = entry;
            }
          });
          this.cache.saleDetails = validSaleDetails;
        }

        if (parsedCache.productTransactions) {
          const validProductTransactions = {};
          Object.entries(parsedCache.productTransactions).forEach(([id, entry]) => {
            if (entry.timestamp && entry.data && this.isCacheValid(entry)) {
              validProductTransactions[id] = entry;
            }
          });
          this.cache.productTransactions = validProductTransactions;
        }
      }
    } catch (error) {
      console.error('Error loading cache from localStorage:', error);
    }
  }

  /**
   * Checks if a specific cache entry is still valid based on its timestamp.
   * @param {Object} cacheEntry - The cache entry object ({ data, timestamp, params? }).
   * @param {number} [maxAge=this.cacheConfig.maxAge] - The maximum allowed age in milliseconds.
   * @returns {boolean} True if the cache entry is valid, false otherwise.
   */
  isCacheValid(cacheEntry, maxAge = this.cacheConfig.maxAge) {
    if (!cacheEntry || !cacheEntry.timestamp) {
      return false;
    }

    // Specific check for latestSales to ensure content exists
    if (cacheEntry === this.cache.latestSales && (!cacheEntry.data || !cacheEntry.data.content)) {
      return false;
    }

    // General check for other cache types
    if (cacheEntry !== this.cache.latestSales && !cacheEntry.data) {
      return false;
    }

    const now = Date.now();
    return now - cacheEntry.timestamp < maxAge;
  }

  /**
   * Performs a shallow comparison of two objects to check for equality.
   * Used for comparing query parameters for cache validation.
   * @param {Object} obj1 - The first object.
   * @param {Object} obj2 - The second object.
   * @returns {boolean} True if the objects have the same keys and values (shallow), false otherwise.
   */
  areParamsEqual(obj1, obj2) {
    if (!obj1 || !obj2) return obj1 === obj2;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every(key => obj1[key] === obj2[key]);
  }

  /**
   * Invalidates parts or all of the cache. Called after data-mutating operations.
   * Saves the updated (invalidated) cache state to localStorage.
   * @param {('latestSales'|'saleDetails'|'productTransactions')} [type] - The type of cache to invalidate. If omitted, all caches are invalidated.
   * @param {string} [id] - The specific ID for 'saleDetails' or 'productTransactions' cache entries to invalidate. If omitted when type is specified, all entries of that type are invalidated.
   */
  invalidateCache(type, id) {
    if (!type) {
      // Invalidate all caches
      this.cache.latestSales = { data: null, timestamp: null, params: null };
      this.cache.saleDetails = {};
      this.cache.productTransactions = {};
    } else {
      switch (type) {
        case 'latestSales':
          this.cache.latestSales = { data: null, timestamp: null, params: null };
          break;
        case 'saleDetails':
          if (id) {
            delete this.cache.saleDetails[id];
          } else {
            this.cache.saleDetails = {};
          }
          break;
        case 'productTransactions':
          if (id) {
            delete this.cache.productTransactions[id];
          } else {
            this.cache.productTransactions = {};
          }
          break;
        default:
          console.warn(`Attempted to invalidate unknown cache type: ${type}`);
          break;
      }
    }
    this.saveCacheToStorage();
  }

  /**
   * Creates a new sale transaction by sending data to the API.
   * Invalidates the cache upon successful creation.
   * @param {Object} transactionData - The data for the new transaction, including cart items, payment details, etc.
   * @returns {Promise<Object>} Promise resolving to the created transaction data from the API.
   * @throws {Error} Throws an error if the API call fails.
   */
  async createSaleTransaction(transactionData) {
    try {
      const positions = transactionData.cartItems.map(item => ({
        productDTO: { id: item.id },
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity,
        discountValue: item.discount || 0,
      }));

      let payments = [];
      if (
        transactionData.payments &&
        Array.isArray(transactionData.payments) &&
        transactionData.payments.length > 0
      ) {
        payments = transactionData.payments;
      } else {
        // Fallback logic if structured payments array is not provided
        let giftCardTotal = 0;
        if (transactionData.appliedVouchers && transactionData.appliedVouchers.length > 0) {
          const giftCardVouchers = transactionData.appliedVouchers.filter(
            voucher => voucher.type === 'GIFT_CARD'
          );
          for (const voucher of giftCardVouchers) {
            const voucherAmount = parseFloat(voucher.amount) || 0;
            if (voucherAmount > 0) {
              giftCardTotal += voucherAmount;
              payments.push({
                type: 'GIFTCARD',
                amount: voucherAmount,
                giftcardId: voucher.id,
              });
            }
          }

          const discountVouchers = transactionData.appliedVouchers.filter(
            voucher => voucher.type === 'DISCOUNT_CARD'
          );
          if (discountVouchers.length > 0 && transactionData.voucherDiscount > 0) {
            const discountVoucher = discountVouchers[0];
            const discountAmount = parseFloat(transactionData.voucherDiscount) || 0;
            giftCardTotal += discountAmount;
            payments.push({
              type: 'GIFTCARD',
              amount: discountAmount,
              giftcardId: discountVoucher.id,
            });
          }
        }

        const depositCredit = parseFloat(transactionData.depositCredit) || 0;
        const remainingAmount = Math.max(0, transactionData.total - giftCardTotal - depositCredit);

        if (transactionData.paymentMethod === 'cash') {
          const parsedCashReceived = parseFloat(transactionData.cashReceived) || 0;
          const handedAmount =
            parsedCashReceived > 0 ? parsedCashReceived : Math.max(remainingAmount, 0.01);
          payments.push({
            type: 'CASH',
            amount: remainingAmount,
            handed: handedAmount,
            change: Math.max(0, Math.round((handedAmount - remainingAmount) * 100) / 100),
          });
        } else if (transactionData.paymentMethod === 'card' && remainingAmount > 0) {
          payments.push({
            type: 'CARD',
            amount: remainingAmount,
            cardDetails: {
              cardNumber: transactionData.cardDetails?.cardNumber,
              cardHolderName: transactionData.cardDetails?.cardHolderName,
              expirationDate: transactionData.cardDetails?.expirationDate,
              cvv: transactionData.cardDetails?.cvv,
            },
          });
        }
      }

      const depositReceipts = [];
      if (transactionData.depositReceipts && transactionData.depositReceipts.length > 0) {
        for (const receipt of transactionData.depositReceipts) {
          depositReceipts.push({ id: receipt.id });
        }
      }

      const saleDTO = {
        positions,
        payments,
        depositReceipts,
        total: transactionData.subtotal,
      };

      const response = await apiClient.post('/v1/sale', saleDTO);
      this.invalidateCache(); // Invalidate all caches after creation
      return response.data;
    } catch (error) {
      console.error('Error creating sale transaction:', error);
      throw error;
    }
  }

  /**
   * Fetches the latest sales transactions, utilizing cache if possible.
   * Uses different cache expiry for dashboard-like requests (small page size).
   * @param {Object} [pageable={ page: 0, size: 5 }] - Pagination parameters.
   * @param {boolean} [forceRefresh=false] - If true, bypasses the cache and fetches fresh data.
   * @returns {Promise<Object>} Promise resolving to an object containing paginated sales data and a flag indicating if it came from cache: { data: PaginatedData, isFromCache: boolean }.
   * @throws {Error} Throws an error if the API call fails.
   */
  async getLatestSales(pageable = { page: 0, size: 5 }, forceRefresh = false) {
    try {
      const queryParams = {
        ...pageable,
        expand: 'positions,payments,depositReceipts',
        sort: 'date,desc',
      };

      const isDashboardRequest = pageable.size <= 10;
      const maxAge = isDashboardRequest
        ? this.cacheConfig.dashboardMaxAge
        : this.cacheConfig.maxAge;
      const cacheEntry = this.cache.latestSales;

      if (
        !forceRefresh &&
        this.isCacheValid(cacheEntry, maxAge) &&
        this.areParamsEqual(queryParams, cacheEntry.params)
      ) {
        return {
          data: cacheEntry.data,
          isFromCache: true,
        };
      }

      const response = await apiClient.get('/v1/sale', { params: queryParams });

      // Format data before caching and returning
      if (response.data && response.data.content) {
        response.data.content = response.data.content.map(this.formatSaleData);
      }

      this.cache.latestSales = {
        data: response.data,
        timestamp: Date.now(),
        params: queryParams,
      };
      this.saveCacheToStorage();

      return {
        data: response.data,
        isFromCache: false,
      };
    } catch (error) {
      console.error('Error fetching latest sales:', error);
      throw error;
    }
  }

  /**
   * Formats raw sale data from the API for consistent use in the frontend.
   * Ensures numeric types for amounts, quantities, etc.
   * @param {Object} sale - The raw sale object from the API.
   * @returns {Object} The formatted sale object.
   */
  formatSaleData(sale) {
    return {
      ...sale,
      total: typeof sale.total === 'number' ? sale.total : parseFloat(sale.total || 0),
      positions: Array.isArray(sale.positions)
        ? sale.positions.map(position => ({
            ...position,
            quantity:
              typeof position.quantity === 'number'
                ? position.quantity
                : parseInt(position.quantity || 0, 10),
            discountEuro:
              typeof position.discountEuro === 'number'
                ? position.discountEuro
                : parseFloat(position.discountEuro || 0),
          }))
        : [],
      payments: Array.isArray(sale.payments)
        ? sale.payments.map(payment => ({
            ...payment,
            amount:
              typeof payment.amount === 'number' ? payment.amount : parseFloat(payment.amount || 0),
          }))
        : [],
    };
  }

  /**
   * Fetches a specific transaction by its ID, utilizing cache if possible.
   * @param {string} id - The ID of the transaction to fetch.
   * @param {boolean} [forceRefresh=false] - If true, bypasses the cache and fetches fresh data.
   * @returns {Promise<Object>} Promise resolving to the formatted transaction data.
   * @throws {Error} Throws an error if the API call fails.
   */
  async getTransactionById(id, forceRefresh = false) {
    try {
      const cacheEntry = this.cache.saleDetails[id];

      if (!forceRefresh && this.isCacheValid(cacheEntry)) {
        return cacheEntry.data; // Already formatted when cached
      }

      const response = await apiClient.get(`/v1/sale/${id}`, {
        params: { expand: 'positions,payments,depositReceipts' },
      });

      const formattedData = this.formatSaleData(response.data);

      this.cache.saleDetails[id] = {
        data: formattedData,
        timestamp: Date.now(),
      };
      this.saveCacheToStorage();

      return formattedData;
    } catch (error) {
      console.error(`Error fetching transaction with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Fetches all product-related transactions for a specific product ID, utilizing cache if possible.
   * @param {string} productId - The ID of the product.
   * @param {Object} [pageable={ page: 0, size: 10 }] - Pagination parameters.
   * @param {boolean} [forceRefresh=false] - If true, bypasses the cache and fetches fresh data.
   * @returns {Promise<Object>} Promise resolving to paginated transaction data for the product.
   * @throws {Error} Throws an error if the API call fails.
   */
  async getProductTransactions(productId, pageable = { page: 0, size: 10 }, forceRefresh = false) {
    try {
      const cacheKey = productId;
      const cacheEntry = this.cache.productTransactions[cacheKey];
      const queryParams = {
        ...pageable,
        sort: 'date,desc',
      };

      if (
        !forceRefresh &&
        this.isCacheValid(cacheEntry) &&
        this.areParamsEqual(queryParams, cacheEntry.params)
      ) {
        return cacheEntry.data;
      }

      const response = await apiClient.get(`/v1/transaction/product/product/${productId}`, {
        params: queryParams,
      });

      this.cache.productTransactions[cacheKey] = {
        data: response.data,
        timestamp: Date.now(),
        params: queryParams,
      };
      this.saveCacheToStorage();

      return response.data;
    } catch (error) {
      console.error(`Error fetching transactions for product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Fetches all product-related transactions in the system, utilizing cache if possible.
   * Uses a dedicated cache key 'all' for this type of request.
   * @param {Object} [pageable={ page: 0, size: 10 }] - Pagination parameters.
   * @param {boolean} [forceRefresh=false] - If true, bypasses the cache and fetches fresh data.
   * @returns {Promise<Object>} Promise resolving to paginated transaction data.
   * @throws {Error} Throws an error if the API call fails.
   */
  async getAllProductTransactions(pageable = { page: 0, size: 10 }, forceRefresh = false) {
    try {
      const cacheKey = 'all'; // Use a specific key for 'all product transactions'
      const cacheEntry = this.cache.productTransactions[cacheKey];
      const queryParams = {
        ...pageable,
        sort: 'date,desc',
      };

      if (
        !forceRefresh &&
        this.isCacheValid(cacheEntry) &&
        this.areParamsEqual(queryParams, cacheEntry.params)
      ) {
        return cacheEntry.data;
      }

      const response = await apiClient.get('/v1/transaction/product', {
        params: queryParams,
      });

      this.cache.productTransactions[cacheKey] = {
        data: response.data,
        timestamp: Date.now(),
        params: queryParams,
      };
      this.saveCacheToStorage();

      return response.data;
    } catch (error) {
      console.error('Error fetching all product transactions:', error);
      throw error;
    }
  }

  /**
   * Provides display-friendly information (label and color) for a given transaction type string.
   * @param {string} transactionType - The transaction type string from the API (e.g., 'WAREHOUSE_IN', 'SALE').
   * @returns {{label: string, color: string}} An object containing the display label and a suggested color identifier (e.g., for UI components).
   */
  getTransactionTypeDisplay(transactionType) {
    switch (transactionType) {
      case 'WAREHOUSE_IN':
        return { label: 'Wareneingang', color: 'success' };
      case 'WAREHOUSE_OUT':
        return { label: 'Warenausgang', color: 'error' };
      case 'SALE':
        return { label: 'Verkauf', color: 'info' };
      case 'RETURN':
        return { label: 'Rückgabe', color: 'warning' };
      case 'GIFT_CARD_PAYMENT':
        return { label: 'Gutscheinzahlung', color: 'primary' };
      default:
        return { label: transactionType, color: 'default' };
    }
  }
}

export default new TransactionService();
