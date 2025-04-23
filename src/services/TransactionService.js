import apiClient from './ApiConfig';

/**
 * Service for managing sales transactions
 */
class TransactionService {
  constructor() {
    // Cache-Objekte für verschiedene Datentypen
    this.cache = {
      latestSales: {
        data: null,
        timestamp: null,
        params: null,
      },
      saleDetails: {}, // key: saleId, value: {data, timestamp}
      productTransactions: {}, // key: productId, value: {data, timestamp, params}
    };

    // Cache-Konfiguration
    this.cacheConfig = {
      // Wie lange der Cache gültig ist (in Millisekunden)
      maxAge: 2 * 60 * 1000, // 2 Minuten Standard-Cache-Zeit
      dashboardMaxAge: 5 * 60 * 1000, // 5 Minuten für Dashboard-Daten (häufiger aktualisiert)
      storageKey: 'vendura_transaction_cache', // Schlüssel für den LocalStorage
    };

    // Load cache from localStorage on service initialization
    this.loadCacheFromStorage();
  }

  /**
   * Speichert den aktuellen Cache im LocalStorage
   */
  saveCacheToStorage() {
    try {
      // Erstelle eine Kopie des Cache-Objekts ohne zirkuläre Referenzen
      const cacheToSave = {
        latestSales: this.cache.latestSales,
        // Speichere auch die Daten für saleDetails, nicht nur die Timestamps
        saleDetails: Object.fromEntries(
          Object.entries(this.cache.saleDetails).map(([id, entry]) => [
            id,
            {
              data: entry.data,
              timestamp: entry.timestamp,
            },
          ])
        ),
        // Speichere auch die Daten für productTransactions, nicht nur die Timestamps
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

      // Speichere den vollständigen Cache im localStorage
      localStorage.setItem(this.cacheConfig.storageKey, JSON.stringify(cacheToSave));
    } catch (error) {
      console.error('Error saving cache to localStorage:', error);
      // Bei Fehlern localStorage-Speicherung überspringen, aber weitermachen
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

        // Prüfen, ob der Cache-Eintrag für latestSales noch gültig ist
        if (
          parsedCache.latestSales &&
          parsedCache.latestSales.data &&
          parsedCache.latestSales.timestamp &&
          this.isCacheValid(parsedCache.latestSales)
        ) {
          // Stelle sicher, dass wir den vollständigen Datensatz inkl. data laden
          this.cache.latestSales = parsedCache.latestSales;
          console.log('Cached latestSales data loaded from localStorage');
        }

        // Lade die vollständigen saleDetails-Daten inklusive der eigentlichen Daten
        if (parsedCache.saleDetails) {
          // Für jedes saleDetail prüfen, ob es noch gültig ist und Daten hat
          const validSaleDetails = {};

          Object.entries(parsedCache.saleDetails).forEach(([id, entry]) => {
            if (entry.timestamp && entry.data && this.isCacheValid(entry)) {
              validSaleDetails[id] = entry;
              console.log(`Cached sale detail data loaded for ID ${id}`);
            }
          });

          this.cache.saleDetails = validSaleDetails;
        }

        // Lade die vollständigen productTransactions-Daten inklusive der eigentlichen Daten
        if (parsedCache.productTransactions) {
          // Für jede productTransaction prüfen, ob sie noch gültig ist und Daten hat
          const validProductTransactions = {};

          Object.entries(parsedCache.productTransactions).forEach(([id, entry]) => {
            if (entry.timestamp && entry.data && this.isCacheValid(entry)) {
              validProductTransactions[id] = entry;
              console.log(`Cached product transaction data loaded for ID ${id}`);
            }
          });

          this.cache.productTransactions = validProductTransactions;
        }
      }
    } catch (error) {
      console.error('Error loading cache from localStorage:', error);
      // Bei Fehlern den In-Memory-Cache verwenden
    }
  }

  /**
   * Prüft, ob der Cache für einen bestimmten Schlüssel noch gültig ist
   * @param {Object} cacheEntry - Der Cache-Eintrag mit data und timestamp
   * @param {number} maxAge - Maximales Alter des Caches in Millisekunden
   * @returns {boolean} True wenn der Cache noch gültig ist, sonst false
   */
  isCacheValid(cacheEntry, maxAge = this.cacheConfig.maxAge) {
    // Prüfe, ob der Cache-Eintrag existiert und alle erforderlichen Felder hat
    if (!cacheEntry || !cacheEntry.timestamp) {
      return false;
    }

    // Bei latestSales müssen wir sicherstellen, dass data vorhanden ist
    if (cacheEntry === this.cache.latestSales && (!cacheEntry.data || !cacheEntry.data.content)) {
      return false;
    }

    // Prüfe für andere Cache-Einträge
    if (cacheEntry !== this.cache.latestSales && !cacheEntry.data) {
      return false;
    }

    // Prüfe, ob der Cache noch nicht abgelaufen ist
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
      // Prepare position data (cart items)
      const positions = transactionData.cartItems.map(item => ({
        productDTO: { id: item.id },
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity,
        discountValue: item.discount || 0,
      }));

      // Prepare payments data
      const payments = [];

      // Add gift card payments if applicable
      let giftCardTotal = 0;

      if (transactionData.appliedVouchers && transactionData.appliedVouchers.length > 0) {
        // Filter for gift card type vouchers only
        const giftCardVouchers = transactionData.appliedVouchers.filter(
          voucher => voucher.type === 'GIFT_CARD'
        );

        // Add each gift card as a payment
        for (const voucher of giftCardVouchers) {
          const voucherAmount = parseFloat(voucher.amount) || 0;
          giftCardTotal += voucherAmount;
          payments.push({
            type: 'GIFTCARD',
            amount: voucherAmount,
            giftcardId: voucher.id,
          });
        }

        // Apply discount cards if any
        const discountVouchers = transactionData.appliedVouchers.filter(
          voucher => voucher.type === 'DISCOUNT_CARD'
        );

        if (discountVouchers.length > 0) {
          // For simplicity, just use the first discount card
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

      // Prepare deposit receipts data
      const depositReceipts = [];
      let depositTotal = 0;

      // Add deposit receipts if applicable
      if (transactionData.depositReceipts && transactionData.depositReceipts.length > 0) {
        for (const receipt of transactionData.depositReceipts) {
          // Jeder Pfandbeleg kann entweder ein 'value' oder ein 'total' Feld haben
          // Wir müssen beide Fälle behandeln, um sicherzustellen, dass wir den korrekten Wert erhalten
          const receiptValue = parseFloat(receipt.value || receipt.total || 0);

          depositTotal += receiptValue;
          depositReceipts.push({
            id: receipt.id,
          });
        }
      }

      // Only add cash/card payment if the gift card and deposit receipts don't cover the full amount
      const isFullyCoveredByGiftCards = Math.abs(giftCardTotal - transactionData.total) < 0.01;

      // If the payment is intended to be fully covered by deposit receipts, don't add additional payment methods
      if (transactionData.useDepositAsPayment) {
        // Ensure that the total equals the depositCredit amount for deposit-only payments
        if (Math.abs(transactionData.depositCredit - transactionData.total) > 0.01) {
          throw new Error(
            'Pfandguthaben entspricht nicht dem Gesamtbetrag. Bitte verwenden Sie eine andere Zahlungsmethode.'
          );
        }
      } else if (!isFullyCoveredByGiftCards) {
        // Der verbleibende Betrag ist einfach der Gesamtbetrag minus Gutscheinbeträge
        // Das Pfandguthaben ist bereits in total berücksichtigt
        const remainingAmount = Math.max(0, transactionData.total - giftCardTotal);

        // Add cash payment if applicable
        if (transactionData.paymentMethod === 'cash') {
          payments.push({
            type: 'CASH',
            amount: parseFloat(remainingAmount.toFixed(2)),
            handed: transactionData.cashReceived,
            change: transactionData.change,
          });
        }

        // Add card payment if applicable
        if (transactionData.paymentMethod === 'card') {
          payments.push({
            type: 'CARD',
            amount: parseFloat(remainingAmount.toFixed(2)),
            cardDetails: {
              cardNumber: transactionData.cardDetails?.cardNumber,
              cardHolderName: transactionData.cardDetails?.cardHolderName,
              expirationDate: transactionData.cardDetails?.expirationDate,
              cvv: transactionData.cardDetails?.cvv,
            },
          });
        }
      }

      // Construct sale DTO
      const saleDTO = {
        positions,
        payments,
        depositReceipts,
        total: transactionData.subtotal,
      };

      // Send to backend
      const response = await apiClient.post('/v1/sale', saleDTO);

      // Bei erfolgreicher Transaktion Cache invalidieren
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
      // Alle Caches invalidieren
      this.cache.latestSales = { data: null, timestamp: null, params: null };
      this.cache.saleDetails = {};
      this.cache.productTransactions = {};

      // Cache im localStorage aktualisieren
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

    // Cache im localStorage aktualisieren
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
      // Größere Detailgenauigkeit anfordern mit Expand-Parameter
      const queryParams = {
        ...pageable,
        expand: 'positions,payments,depositReceipts',
        sort: 'date,desc', // Sortierung nach Datum absteigend (neueste zuerst)
      };

      // WICHTIG: Die Sortierung 'date,desc' garantiert, dass die neuesten Verkäufe
      // zuerst angezeigt werden. Im Frontend werden die ersten Einträge der Liste
      // für Dashboards und Übersichten verwendet.

      // Cache-Validität prüfen (für Dashboard kürzere Lebensdauer)
      const isDashboardRequest = pageable.size <= 10;
      const maxAge = isDashboardRequest
        ? this.cacheConfig.dashboardMaxAge
        : this.cacheConfig.maxAge;

      // Prüfe, ob wir gültige gecachte Daten für diese Parameter haben
      const cacheEntry = this.cache.latestSales;

      if (
        !forceRefresh &&
        this.isCacheValid(cacheEntry, maxAge) &&
        this.areParamsEqual(queryParams, cacheEntry.params)
      ) {
        // Gib ein Objekt zurück, das sowohl die Daten als auch die Information enthält,
        // dass die Daten aus dem Cache kommen
        return {
          data: cacheEntry.data,
          isFromCache: true,
        };
      }

      // Wenn kein gültiger Cache, Daten vom Server holen
      const response = await apiClient.get('/v1/sale', { params: queryParams });

      // Formatiere die Daten für die Anzeige
      if (response.data && response.data.content) {
        response.data.content = response.data.content.map(this.formatSaleData);
      }

      // Aktualisiere den Cache
      this.cache.latestSales = {
        data: response.data,
        timestamp: Date.now(),
        params: queryParams,
      };

      // Cache im localStorage aktualisieren
      this.saveCacheToStorage();

      // Gib ein Objekt zurück, das die Information enthält, dass die Daten nicht aus dem Cache kommen
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
    // Formatiere Verkaufsdaten für die Anzeige
    return {
      ...sale,
      // Stelle sicher, dass total als Zahl vorliegt
      total: typeof sale.total === 'number' ? sale.total : parseFloat(sale.total || 0),
      // Stelle sicher, dass positions ein Array ist
      positions: Array.isArray(sale.positions)
        ? sale.positions.map(position => ({
            ...position,
            // Stelle sicher, dass quantity als Zahl vorliegt
            quantity:
              typeof position.quantity === 'number'
                ? position.quantity
                : parseInt(position.quantity || 0, 10),
            // Stelle sicher, dass discountEuro als Zahl vorliegt
            discountEuro:
              typeof position.discountEuro === 'number'
                ? position.discountEuro
                : parseFloat(position.discountEuro || 0),
          }))
        : [],
      // Stelle sicher, dass payments ein Array ist
      payments: Array.isArray(sale.payments)
        ? sale.payments.map(payment => ({
            ...payment,
            // Stelle sicher, dass amount als Zahl vorliegt
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
      // Prüfe, ob wir einen gültigen Cache für diese ID haben
      const cacheEntry = this.cache.saleDetails[id];

      if (!forceRefresh && this.isCacheValid(cacheEntry)) {
        console.log(`Using cached sale data for ID ${id}`);
        return cacheEntry.data;
      }

      // Wenn kein gültiger Cache, Daten vom Server holen
      const response = await apiClient.get(`/v1/sale/${id}`, {
        params: { expand: 'positions,payments,depositReceipts' },
      });

      // Formatierte Daten
      const formattedData = this.formatSaleData(response.data);

      // Aktualisiere den Cache
      this.cache.saleDetails[id] = {
        data: formattedData,
        timestamp: Date.now(),
      };

      // Cache im localStorage aktualisieren
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
      // Prüfe, ob wir einen gültigen Cache für diese Produkt-ID und Parameter haben
      const cacheKey = productId;
      const cacheEntry = this.cache.productTransactions[cacheKey];

      // Ergänze Sort-Parameter für Sortierung
      const queryParams = {
        ...pageable,
        sort: 'date,desc', // Sortierung nach Datum absteigend (neueste zuerst)
      };

      if (
        !forceRefresh &&
        this.isCacheValid(cacheEntry) &&
        this.areParamsEqual(queryParams, cacheEntry.params)
      ) {
        console.log(`Using cached product transactions for product ID ${productId}`);
        return cacheEntry.data;
      }

      // Wenn kein gültiger Cache, Daten vom Server holen
      const response = await apiClient.get(`/v1/transaction/product/product/${productId}`, {
        params: queryParams,
      });

      // Aktualisiere den Cache
      this.cache.productTransactions[cacheKey] = {
        data: response.data,
        timestamp: Date.now(),
        params: queryParams,
      };

      // Cache im localStorage aktualisieren
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
      // Prüfe, ob wir einen gültigen Cache für diese Parameter haben
      const cacheKey = 'all';
      const cacheEntry = this.cache.productTransactions[cacheKey];

      // Ergänze Sort-Parameter für Sortierung
      const queryParams = {
        ...pageable,
        sort: 'date,desc', // Sortierung nach Datum absteigend (neueste zuerst)
      };

      if (
        !forceRefresh &&
        this.isCacheValid(cacheEntry) &&
        this.areParamsEqual(queryParams, cacheEntry.params)
      ) {
        console.log('Using cached all product transactions');
        return cacheEntry.data;
      }

      // Wenn kein gültiger Cache, Daten vom Server holen
      const response = await apiClient.get('/v1/transaction/product', {
        params: queryParams,
      });

      // Aktualisiere den Cache
      this.cache.productTransactions[cacheKey] = {
        data: response.data,
        timestamp: Date.now(),
        params: queryParams,
      };

      // Cache im localStorage aktualisieren
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
