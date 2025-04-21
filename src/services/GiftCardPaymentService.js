import apiClient from './ApiConfig';
import GiftCardService from './GiftCardService';

/**
 * Service für die Verwaltung von Geschenkkarten-Zahlungen
 */
class GiftCardPaymentService {
  /**
   * Erstellt eine Transaktion für eine Geschenkkarte
   * @param {String} giftCardId - Die ID der Geschenkkarte
   * @param {Number} amount - Der Betrag der Transaktion
   * @param {String} orderId - Optional: Die ID der Bestellung
   * @returns {Promise} Promise mit dem Ergebnis der Transaktion
   */
  async createTransaction(giftCardId, amount, orderId = null) {
    try {
      const payload = {
        giftCardId,
        amount,
        orderId,
      };

      const response = await apiClient.post('/v1/payment/giftcard/transaction', payload);
      return response.data;
    } catch (error) {
      console.error(`Error creating transaction for gift card ${giftCardId}:`, error);
      throw error;
    }
  }

  /**
   * Verarbeitet eine Zahlung mit Geschenkkarte
   * @param {String} giftCardId - Die ID der Geschenkkarte
   * @param {Number} amount - Der zu verwendende Betrag
   * @param {String} orderId - Optional: Die ID der Bestellung
   * @returns {Promise} Promise mit dem Ergebnis der Zahlung
   */
  async processGiftCardPayment(giftCardId, amount, orderId = null) {
    try {
      // Zunächst prüfen, ob genügend Guthaben vorhanden ist
      const remainingBalance = await GiftCardService.calculateRemainingBalance(giftCardId);

      if (remainingBalance < amount) {
        throw new Error(
          `Insufficient balance: ${remainingBalance.toFixed(2)}€ available, ${amount.toFixed(2)}€ requested`
        );
      }

      const payload = {
        giftCardId,
        amount,
        orderId,
      };

      const response = await apiClient.post('/v1/payment/giftcard', payload);
      return response.data;
    } catch (error) {
      console.error(`Error processing gift card payment for card ${giftCardId}:`, error);
      throw error;
    }
  }

  /**
   * Verwendet eine Rabattkarte für einen Kauf
   * @param {String} discountCardId - Die ID der Rabattkarte
   * @param {Number} orderTotal - Die Gesamtsumme der Bestellung
   * @param {String} orderId - Optional: Die ID der Bestellung
   * @returns {Promise} Promise mit dem berechneten Rabatt
   */
  async applyDiscountCard(discountCardId, orderTotal, orderId = null) {
    try {
      // Prüfen, ob die Rabattkarte noch nutzbar ist
      const info = await GiftCardService.getTransactionalInformation(discountCardId);

      if (!info || info.type !== 'DISCOUNT_CARD') {
        throw new Error('Invalid discount card');
      }

      if (!info.remainingUsages || info.remainingUsages <= 0) {
        throw new Error('No remaining usages for this discount card');
      }

      const discountAmount = orderTotal * (info.discountPercentage / 100);

      const payload = {
        discountCardId,
        discountPercentage: info.discountPercentage,
        discountAmount,
        orderTotal,
        orderId,
      };

      const response = await apiClient.post('/v1/payment/discount', payload);
      return {
        ...response.data,
        discountAmount,
        remainingUsages: info.remainingUsages - 1,
      };
    } catch (error) {
      console.error(`Error applying discount card ${discountCardId}:`, error);
      throw error;
    }
  }

  /**
   * Berechnet den Gesamtrabatt aus mehreren Gutscheinen
   * @param {Array} appliedVouchers - Array mit allen angewendeten Gutscheinen
   * @param {Number} orderTotal - Gesamtsumme der Bestellung vor Rabatten
   * @returns {Object} Berechnete Rabatte und Zahlungen
   */
  calculateTotalVoucherDiscount(appliedVouchers, orderTotal) {
    if (!appliedVouchers || appliedVouchers.length === 0) {
      return {
        discountAmount: 0,
        giftCardPayment: 0,
        remainingTotal: orderTotal,
      };
    }

    const discountVouchers = appliedVouchers.filter(v => v.type === 'DISCOUNT_CARD');
    const giftCardVouchers = appliedVouchers.filter(v => v.type === 'GIFT_CARD');

    // Berechne prozentualen Rabatt (nur vom ersten Rabattgutschein)
    let discountAmount = 0;
    if (discountVouchers.length > 0) {
      const discountCard = discountVouchers[0];
      discountAmount = orderTotal * (discountCard.discountPercentage / 100);
    }

    // Berechne Geschenkkarten-Zahlungen
    const giftCardPayment = giftCardVouchers.reduce((total, card) => total + (card.amount || 0), 0);

    // Berechne verbleibende Summe
    const remainingTotal = Math.max(0, orderTotal - discountAmount - giftCardPayment);

    return {
      discountAmount,
      giftCardPayment,
      remainingTotal,
    };
  }

  /**
   * Validiert alle angewendeten Gutscheine für eine Transaktion
   * @param {Array} appliedVouchers - Array mit allen angewendeten Gutscheinen
   * @returns {Promise<Object>} Validierungsergebnis mit Status und ggf. Fehlermeldungen
   */
  async validateVouchers(appliedVouchers) {
    if (!appliedVouchers || appliedVouchers.length === 0) {
      return { valid: true };
    }

    const errors = [];

    for (const voucher of appliedVouchers) {
      try {
        const voucherInfo = await GiftCardService.getTransactionalInformation(voucher.id);

        if (voucher.type === 'GIFT_CARD') {
          if (!voucherInfo.remainingBalance || voucherInfo.remainingBalance < voucher.amount) {
            errors.push(`Geschenkkarte ${voucher.id} hat nicht genügend Guthaben`);
          }
        } else if (voucher.type === 'DISCOUNT_CARD') {
          if (!voucherInfo.remainingUsages || voucherInfo.remainingUsages <= 0) {
            errors.push(`Rabattkarte ${voucher.id} hat keine Verwendungen mehr übrig`);
          }
        }

        // Überprüfe Ablaufdatum
        if (voucherInfo.expirationDate && new Date(voucherInfo.expirationDate) < new Date()) {
          errors.push(`Gutschein ${voucher.id} ist abgelaufen`);
        }
      } catch (error) {
        errors.push(
          `Fehler beim Validieren von Gutschein ${voucher.id}: ${error.message || 'Unbekannter Fehler'}`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default new GiftCardPaymentService();
