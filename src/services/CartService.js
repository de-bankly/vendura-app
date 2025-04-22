/**
 * Service for managing shopping cart operations
 */
class CartService {
  constructor() {
    // Lazy load the CartMementoService to avoid circular dependency issues
    this._mementoService = null;
    this._mementoServicePromise = null;
  }

  /**
   * Get the memento service instance
   * @returns {Promise<CartMementoService>} The memento service instance
   * @private
   */
  async _getMementoService() {
    if (!this._mementoService) {
      if (!this._mementoServicePromise) {
        // Use dynamic import instead of require
        this._mementoServicePromise = import('./cart/CartMementoService').then(module => {
          this._mementoService = module.default;
          return this._mementoService;
        });
      }
      await this._mementoServicePromise;
    }
    return this._mementoService;
  }

  /**
   * Add a product to the cart
   * @param {Array} cartItems Current cart items
   * @param {Object} product Product to add
   * @returns {Array} Updated cart items
   */
  addToCart(cartItems, product) {
    const existingItem = cartItems.find(item => item.id === product.id);
    let updatedCartItems;

    if (existingItem) {
      updatedCartItems = cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCartItems = [...cartItems, { ...product, quantity: 1 }];
    }

    // Update cart locally first
    this._updateMementoServiceAsync(updatedCartItems);
    return updatedCartItems;
  }

  /**
   * Remove a product from the cart
   * @param {Array} cartItems Current cart items
   * @param {number} productId ID of product to remove
   * @returns {Array} Updated cart items
   */
  removeFromCart(cartItems, productId) {
    const existingItem = cartItems.find(item => item.id === productId);
    let updatedCartItems;

    if (existingItem && existingItem.quantity > 1) {
      updatedCartItems = cartItems.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    } else {
      updatedCartItems = cartItems.filter(item => item.id !== productId);
    }

    // Update cart locally first
    this._updateMementoServiceAsync(updatedCartItems);
    return updatedCartItems;
  }

  /**
   * Delete a product from the cart
   * @param {Array} cartItems Current cart items
   * @param {number} productId ID of product to delete
   * @returns {Array} Updated cart items
   */
  deleteFromCart(cartItems, productId) {
    const updatedCartItems = cartItems.filter(item => item.id !== productId);

    // Update cart locally first
    this._updateMementoServiceAsync(updatedCartItems);
    return updatedCartItems;
  }

  /**
   * Update memento service asynchronously without blocking
   * @param {Array} cartItems Cart items to update
   * @private
   */
  _updateMementoServiceAsync(cartItems) {
    // Fire and forget - don't block UI operations
    this._getMementoService()
      .then(service => {
        service.updateCartItems(cartItems);
      })
      .catch(err => {
        console.error('Failed to update cart memento:', err);
      });
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

  /**
   * Save the current cart state
   * @param {Array} cartItems Current cart items
   * @param {Array} appliedVouchers Current applied vouchers
   * @param {string} label Optional label for the saved state
   * @returns {Promise<boolean>} Promise resolving to true if save was successful
   */
  async saveCartState(cartItems, appliedVouchers, label = null) {
    try {
      const mementoService = await this._getMementoService();
      mementoService.updateCartItems(cartItems);
      mementoService.updateAppliedVouchers(appliedVouchers || []);
      return mementoService.saveState(label);
    } catch (err) {
      console.error('Failed to save cart state:', err);
      return false;
    }
  }

  /**
   * Undo to the previous cart state
   * @returns {Object|null} Object containing the restored cart items and applied vouchers, or null if undo failed
   */
  undoCartState() {
    return this._getMementoService().then(service => service.undo());
  }

  /**
   * Redo to the next cart state
   * @returns {Object|null} Object containing the restored cart items and applied vouchers, or null if redo failed
   */
  redoCartState() {
    return this._getMementoService().then(service => service.redo());
  }

  /**
   * Check if undo is available
   * @returns {boolean} True if undo is available
   */
  canUndoCartState() {
    // Default to false if service not yet loaded
    if (!this._mementoService) return false;
    return this._mementoService.canUndo();
  }

  /**
   * Check if redo is available
   * @returns {boolean} True if redo is available
   */
  canRedoCartState() {
    // Default to false if service not yet loaded
    if (!this._mementoService) return false;
    return this._mementoService.canRedo();
  }

  /**
   * Get all saved cart states
   * @returns {Array} Array of saved cart states
   */
  getAllSavedCartStates() {
    return this._getMementoService().then(service => service.getAllSavedStates());
  }

  /**
   * Restore a specific saved cart state
   * @param {number} index Index of the saved state to restore
   * @returns {Object|null} Object containing the restored cart items and applied vouchers, or null if restore failed
   */
  restoreCartState(index) {
    return this._getMementoService().then(service => service.restoreStateByIndex(index));
  }

  /**
   * Clear all saved cart states
   */
  clearCartHistory() {
    this._getMementoService().then(service => service.clearHistory());
  }

  /**
   * Enable or disable auto-saving of cart states
   * @param {boolean} enabled Whether auto-saving should be enabled
   */
  setCartAutoSaveEnabled(enabled) {
    this._getMementoService().then(service => service.setAutoSaveEnabled(enabled));
  }
}

export default new CartService();
