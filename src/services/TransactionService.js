import apiClient from './ApiConfig';

/**
 * Service for managing sales transactions
 */
class TransactionService {
  constructor() {
    this.cache = {
      latestSales: {
        data: null,
        timestamp: null,
        params: null,
      },
      saleDetails: {}, // key: saleId, value: {data, timestamp}
      productTransactions: {}, // key: productId, value: {data, timestamp, params}
    };

    this.cacheConfig = {
      maxAge: 2 * 60 * 1000, // 2 Minuten Standard-Cache-Zeit
      dashboardMaxAge: 5 * 60 * 1000, // 5 Minuten für Dashboard-Daten (häufiger aktualisiert)
      storageKey: 'vendura_transaction_cache', // Schlüssel für den LocalStorage
    };

    this.loadCacheFromStorage();
  }

  /**
   * Speichert den aktuellen Cache im LocalStorage
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
   * Lädt den Cache aus dem LocalStorage
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
   * Prüft, ob der Cache für einen bestimmten Schlüssel noch gültig ist
   * @param {Object} cacheEntry - Der Cache-Eintrag mit data und timestamp
   * @param {number} maxAge - Maximales Alter des Caches in Millisekunden
   * @returns {boolean} True wenn der Cache noch gültig ist, sonst false
   */
  isCacheValid(cacheEntry, maxAge = this.cacheConfig.maxAge) {
    if (!cacheEntry || !cacheEntry.timestamp) {
      return false;
    }

    if (cacheEntry === this.cache.latestSales && (!cacheEntry.data || !cacheEntry.data.content)) {
      return false;
    }

    if (cacheEntry !== this.cache.latestSales && !cacheEntry.data) {
      return false;
    }

    const now = Date.now();
    return now - cacheEntry.timestamp < maxAge;
  }

  /**
   * Vergleicht zwei Objekte auf Gleichheit (flach)
   * @param {Object} obj1 - Erstes Objekt
   * @param {Object} obj2 - Zweites Objekt
   * @returns {boolean} True wenn die Objekte gleich sind, sonst false
   */
  areParamsEqual(obj1, obj2) {
    if (!obj1 || !obj2) return obj1 === obj2;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every(key => obj1[key] === obj2[key]);
  }

  /**
   * Create a new sale transaction
   * @param {Object} transactionData - The transaction data
   * @returns {Promise} Promise resolving to the created transaction
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
          depositReceipts.push({
            id: receipt.id,
          });
        }
      }

      const saleDTO = {
        positions,
        payments,
        depositReceipts,
        total: transactionData.subtotal,
      };

      const response = await apiClient.post('/v1/sale', saleDTO);

      this.invalidateCache();

      return response.data;
    } catch (error) {
      console.error('Error creating sale transaction:', error);
      throw error;
    }
  }

  /**
   * Invalidiert relevante Caches nach Datenänderungen
   * @param {string} type - Optional: Typ des Caches, der invalidiert werden soll
   * @param {string} id - Optional: ID für spezifische Cache-Einträge (z.B. saleId)
   */
  invalidateCache(type, id) {
    if (!type) {
      this.cache.latestSales = { data: null, timestamp: null, params: null };
      this.cache.saleDetails = {};
      this.cache.productTransactions = {};

      this.saveCacheToStorage();
      return;
    }

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
        break;
    }

    this.saveCacheToStorage();
  }

  /**
   * Get the latest sales
   * @param {Object} pageable - Pagination parameters
   * @param {boolean} forceRefresh - Falls true, wird der Cache ignoriert
   * @returns {Promise} Promise resolving to paginated sales data
   */
  async getLatestSales(pageable = { page: 0, size: 5 }, forceRefresh = false) {
    try {
      const queryParams = {
        ...pageable,
        expand: 'positions,payments,depositReceipts',
        sort: 'date,desc', // Sortierung nach Datum absteigend (neueste zuerst)
      };

      // WICHTIG: Die Sortierung 'date,desc' garantiert, dass die neuesten Verkäufe
      // zuerst angezeigt werden. Im Frontend werden die ersten Einträge der Liste
      // für Dashboards und Übersichten verwendet.

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
   * Format sale data for display
   * @param {Object} sale - Sale data from API
   * @returns {Object} Formatted sale data
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
   * Get a specific transaction by ID
   * @param {String} id - The transaction ID
   * @param {boolean} forceRefresh - Falls true, wird der Cache ignoriert
   * @returns {Promise} Promise resolving to transaction data
   */
  async getTransactionById(id, forceRefresh = false) {
    try {
      const cacheEntry = this.cache.saleDetails[id];

      if (!forceRefresh && this.isCacheValid(cacheEntry)) {
        return cacheEntry.data;
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
   * Get all transactions for a product
   * @param {String} productId - The ID of the product
   * @param {Object} pageable - Pagination parameters
   * @param {boolean} forceRefresh - Falls true, wird der Cache ignoriert
   * @returns {Promise} Promise resolving to transaction data
   */
  async getProductTransactions(productId, pageable = { page: 0, size: 10 }, forceRefresh = false) {
    try {
      const cacheKey = productId;
      const cacheEntry = this.cache.productTransactions[cacheKey];

      const queryParams = {
        ...pageable,
        sort: 'date,desc', // Sortierung nach Datum absteigend (neueste zuerst)
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
   * Get all product transactions in the system
   * @param {Object} pageable - Pagination parameters
   * @param {boolean} forceRefresh - Falls true, wird der Cache ignoriert
   * @returns {Promise} Promise resolving to transaction data
   */
  async getAllProductTransactions(pageable = { page: 0, size: 10 }, forceRefresh = false) {
    try {
      const cacheKey = 'all';
      const cacheEntry = this.cache.productTransactions[cacheKey];

      const queryParams = {
        ...pageable,
        sort: 'date,desc', // Sortierung nach Datum absteigend (neueste zuerst)
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
   * Format transaction type for display
   * @param {String} transactionType - Transaction type from API
   * @returns {Object} Formatted display information
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
