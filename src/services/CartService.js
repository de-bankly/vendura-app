/**
 * Service for managing shopping cart operations
 */
class CartService {
  /**
   * Add a product to the cart
   * @param {Array} cartItems Current cart items
   * @param {Object} product Product to add
   * @returns {Array} Updated cart items
   */
  addToCart(cartItems, product) {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      return cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      return [...cartItems, { ...product, quantity: 1 }];
    }
  }

  /**
   * Remove a product from the cart
   * @param {Array} cartItems Current cart items
   * @param {number} productId ID of product to remove
   * @returns {Array} Updated cart items
   */
  removeFromCart(cartItems, productId) {
    const existingItem = cartItems.find(item => item.id === productId);
    if (existingItem && existingItem.quantity > 1) {
      return cartItems.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    } else {
      return cartItems.filter(item => item.id !== productId);
    }
  }

  /**
   * Delete a product from the cart
   * @param {Array} cartItems Current cart items
   * @param {number} productId ID of product to delete
   * @returns {Array} Updated cart items
   */
  deleteFromCart(cartItems, productId) {
    return cartItems.filter(item => item.id !== productId);
  }

  /**
   * Calculate subtotal of cart items
   * @param {Array} cartItems Cart items
   * @returns {number} Subtotal
   */
  calculateSubtotal(cartItems) {
    return cartItems.reduce((sum, item) => {
      // Check if item has a discount, use discounted price if available
      let price;
      if (item.hasDiscount && item.discountedPrice !== undefined) {
        price = parseFloat(item.discountedPrice) || 0;
      } else {
        price = parseFloat(item.price) || 0;
      }

      const quantity = parseInt(item.quantity) || 0;
      return sum + price * quantity;
    }, 0);
  }

  /**
   * Get the effective price for an item (considering discounts)
   * @param {Object} item Cart item
   * @returns {number} Effective price
   */
  getItemEffectivePrice(item) {
    if (item.hasDiscount && item.discountedPrice !== undefined) {
      return parseFloat(item.discountedPrice) || 0;
    }
    return parseFloat(item.price) || 0;
  }

  /**
   * Calculate total discount amount for cart items
   * @param {Array} cartItems Cart items
   * @returns {number} Total discount amount
   */
  calculateTotalDiscount(cartItems) {
    return cartItems.reduce((sum, item) => {
      if (
        item.hasDiscount &&
        item.originalPrice !== undefined &&
        item.discountedPrice !== undefined
      ) {
        const discountPerItem =
          (parseFloat(item.originalPrice) || 0) - (parseFloat(item.discountedPrice) || 0);
        const quantity = parseInt(item.quantity) || 0;
        return sum + discountPerItem * quantity;
      }
      return sum;
    }, 0);
  }

  /**
   * Calculate voucher discount
   * @param {Array} vouchers Applied vouchers
   * @returns {number} Total discount
   */
  calculateVoucherDiscount(vouchers) {
    return vouchers.reduce((sum, voucher) => {
      // Use the redeemed amount (value) for the discount
      const discountAmount = parseFloat(voucher.value) || 0;
      return sum + discountAmount;
    }, 0);
  }

  /**
   * Calculate total after voucher discount
   * @param {number} subtotal Subtotal
   * @param {number} voucherDiscount Voucher discount
   * @returns {number} Total
   */
  calculateTotal(subtotal, voucherDiscount) {
    return Math.max(0, subtotal - voucherDiscount);
  }

  /**
   * Format cart items for sale submission (adds necessary discount info)
   * @param {Array} cartItems Cart items
   * @returns {Array} Formatted cart items for sale
   */
  formatCartItemsForSale(cartItems) {
    return cartItems.map(item => {
      const formattedItem = {
        id: item.id,
        quantity: item.quantity,
      };

      // Add discount information if available
      if (item.hasDiscount && item.discountAmount) {
        formattedItem.discountEuro = item.discountAmount;
      }

      return formattedItem;
    });
  }
}

export default new CartService();
