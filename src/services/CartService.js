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
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  /**
   * Calculate voucher discount
   * @param {Array} vouchers Applied vouchers
   * @returns {number} Total discount
   */
  calculateVoucherDiscount(vouchers) {
    return vouchers.reduce((sum, voucher) => sum + voucher.value, 0);
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
}

export default new CartService();
