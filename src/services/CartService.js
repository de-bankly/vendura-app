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
          // The service is already an instance, not a class
          this._mementoService = module.default;

          if (!this._mementoService) {
            console.error('Failed to load CartMementoService, module structure:', module);
            throw new Error('CartMementoService not found in imported module');
          }
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
    let updatedCartItems = [...cartItems];

    // Check if the product already exists in cart
    const existingItem = updatedCartItems.find(item => item.id === product.id);

    if (existingItem) {
      // If product already exists, just increment quantity
      updatedCartItems = updatedCartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );

      // If this is a parent product, also increment all its connected products
      if (product.connectedProducts && product.connectedProducts.length > 0) {
        for (const connectedProduct of product.connectedProducts) {
          const existingConnectedItem = updatedCartItems.find(
            item => item.id === connectedProduct.id && item.parentProductId === product.id
          );

          if (existingConnectedItem) {
            updatedCartItems = updatedCartItems.map(item =>
              item.id === connectedProduct.id && item.parentProductId === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }
        }
      }
    } else {
      // Add the product to cart
      updatedCartItems.push({ ...product, quantity: 1 });

      // Add connected products if any
      if (product.connectedProducts && product.connectedProducts.length > 0) {
        product.connectedProducts.forEach(connectedProduct => {
          // Check if this is a Pfand product
          const isPfandProduct = connectedProduct.category?.name === 'Pfand';

          // Create a copy with additional property to mark it as a connected product
          const connectedProductWithParent = {
            ...connectedProduct,
            quantity: 1,
            isConnectedProduct: true,
            isPfandProduct: isPfandProduct, // Mark Pfand products
            parentProductId: product.id,
          };

          updatedCartItems.push(connectedProductWithParent);
        });
      }
    }

    // Update cart locally first
    this._updateMementoServiceAsync(updatedCartItems);
    return updatedCartItems;
  }

  /**
   * Remove a product from the cart
   * @param {Array} cartItems Current cart items
   * @param {string} productId ID of product to remove
   * @returns {Array} Updated cart items
   */
  removeFromCart(cartItems, productId) {
    // Find the item to remove
    const itemToRemove = cartItems.find(item => item.id === productId);
    let updatedCartItems = [...cartItems]; // Start with a copy

    // If it's a connected product or Pfand product, don't remove it
    if (itemToRemove && (itemToRemove.isConnectedProduct || itemToRemove.isPfandProduct)) {
      // No change, return original items (no memento update needed)
      return cartItems;
    }

    // Handle parent product removal (decrement or remove completely)
    if (itemToRemove && !itemToRemove.isConnectedProduct) {
      // If quantity is more than 1, just decrement
      if (itemToRemove.quantity > 1) {
        // Decrement quantity of parent product
        updatedCartItems = updatedCartItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );

        // Find and decrement quantities of connected products as well
        const connectedProductItems = updatedCartItems.filter(
          item => item.parentProductId === productId
        );

        if (connectedProductItems.length > 0) {
          updatedCartItems = updatedCartItems.map(item =>
            item.parentProductId === productId ? { ...item, quantity: item.quantity - 1 } : item
          );

          // Remove connected products with zero quantity (shouldn't happen if parent > 1, but good practice)
          updatedCartItems = updatedCartItems.filter(item => item.quantity > 0);
        }
      } else {
        // Remove the parent product and all its connected products
        updatedCartItems = updatedCartItems.filter(
          item => item.id !== productId && item.parentProductId !== productId
        );
      }
    } else {
      // Handle normal products (not parent, not connected/pfand)
      const existingItem = cartItems.find(item => item.id === productId);

      if (existingItem && existingItem.quantity > 1) {
        updatedCartItems = cartItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        // Remove the item completely if quantity is 1 or item not found (though handled above)
        updatedCartItems = cartItems.filter(item => item.id !== productId);
      }
    }

    // Update cart locally first
    this._updateMementoServiceAsync(updatedCartItems);
    return updatedCartItems;
  }

  /**
   * Delete a product from the cart entirely, regardless of quantity.
   * @param {Array} cartItems Current cart items
   * @param {string} productId ID of product to delete
   * @returns {Array} Updated cart items
   */
  deleteFromCart(cartItems, productId) {
    // Find the item to delete
    const itemToDelete = cartItems.find(item => item.id === productId);
    let updatedCartItems = [...cartItems]; // Start with a copy

    // If it's a connected product or Pfand product, don't allow deletion
    if (itemToDelete && (itemToDelete.isConnectedProduct || itemToDelete.isPfandProduct)) {
      // No change, return original items (no memento update needed)
      return cartItems;
    }

    // If it's a parent product, delete it and all its connected products
    if (itemToDelete && !itemToDelete.isConnectedProduct) {
      updatedCartItems = cartItems.filter(
        item => item.id !== productId && item.parentProductId !== productId
      );
    } else {
      // Default case: normal product deletion (or item not found)
      updatedCartItems = cartItems.filter(item => item.id !== productId);
    }

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
   * Check if an item in the cart is removable (decrementable) or deletable
   * @param {Object} cartItem The cart item to check
   * @returns {boolean} Whether the item can be removed/deleted by user actions
   */
  isItemRemovable(cartItem) {
    // User can only directly remove/delete items that are NOT connected or Pfand
    return !cartItem.isConnectedProduct && !cartItem.isPfandProduct;
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
   * Calculate total discount amount for cart items based on price differences
   * @param {Array} cartItems Cart items
   * @returns {number} Total discount amount
   */
  calculateTotalDiscount(cartItems) {
    return cartItems.reduce((sum, item) => {
      if (
        item.hasDiscount &&
        item.originalPrice !== undefined && // Ensure original price exists for comparison
        item.discountedPrice !== undefined
      ) {
        const originalPrice = parseFloat(item.originalPrice) || 0;
        const discountedPrice = parseFloat(item.discountedPrice) || 0;
        // Ensure discount is positive
        const discountPerItem = Math.max(0, originalPrice - discountedPrice);
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

      // Add discount information if available and meaningful
      if (
        item.hasDiscount &&
        item.originalPrice !== undefined &&
        item.discountedPrice !== undefined
      ) {
        const originalPrice = parseFloat(item.originalPrice) || 0;
        const discountedPrice = parseFloat(item.discountedPrice) || 0;
        const discountAmount = Math.max(0, originalPrice - discountedPrice);
        // Only add discountEuro if there's actually a discount
        if (discountAmount > 0) {
          // Calculate total discount for the quantity of this item
          formattedItem.discountEuro = discountAmount * item.quantity;
        }
      }

      // Add connected product information if it's a connected product
      if (item.isConnectedProduct && item.parentProductId) {
        formattedItem.isConnectedProduct = true;
        formattedItem.parentProductId = item.parentProductId;
      }

      // Add Pfand information if it's a deposit item
      if (item.isPfandProduct) {
        formattedItem.isPfandProduct = true;
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
   * @returns {Promise<Object|null>} Promise resolving to an object containing the restored cart items and applied vouchers, or null if undo failed
   */
  async undoCartState() {
    try {
      const service = await this._getMementoService();
      return service.undo();
    } catch (err) {
      console.error('Failed to undo cart state:', err);
      return null;
    }
  }

  /**
   * Redo to the next cart state
   * @returns {Promise<Object|null>} Promise resolving to an object containing the restored cart items and applied vouchers, or null if redo failed
   */
  async redoCartState() {
    try {
      const service = await this._getMementoService();
      return service.redo();
    } catch (err) {
      console.error('Failed to redo cart state:', err);
      return null;
    }
  }

  /**
   * Check if undo is available
   * @returns {boolean} True if undo is available
   */
  canUndoCartState() {
    // Try to get the memento service if it's not already loaded
    if (!this._mementoService) {
      // Trigger loading in the background, but return false for now
      this._getMementoService().catch(err => {
        console.error('Failed to load memento service for undo check:', err);
      });
      return false;
    }
    return this._mementoService.canUndo();
  }

  /**
   * Check if redo is available
   * @returns {boolean} True if redo is available
   */
  canRedoCartState() {
    // Try to get the memento service if it's not already loaded
    if (!this._mementoService) {
      // Trigger loading in the background, but return false for now
      this._getMementoService().catch(err => {
        console.error('Failed to load memento service for redo check:', err);
      });
      return false;
    }
    return this._mementoService.canRedo();
  }

  /**
   * Get all saved cart states
   * @returns {Promise<Array>} Promise resolving to an array of saved cart states
   */
  async getAllSavedCartStates() {
    try {
      const service = await this._getMementoService();
      return service.getAllSavedStates();
    } catch (err) {
      console.error('Failed to get saved cart states:', err);
      return [];
    }
  }

  /**
   * Restore a specific saved cart state
   * @param {number} index Index of the saved state to restore
   * @returns {Promise<Object|null>} Promise resolving to an object containing the restored cart items and applied vouchers, or null if restore failed
   */
  async restoreCartState(index) {
    try {
      const service = await this._getMementoService();
      return service.restoreStateByIndex(index);
    } catch (err) {
      console.error('Failed to restore cart state:', err);
      return null;
    }
  }

  /**
   * Clear all saved cart states
   * @returns {Promise<void>}
   */
  async clearCartHistory() {
    try {
      const service = await this._getMementoService();
      service.clearHistory();
    } catch (err) {
      console.error('Failed to clear cart history:', err);
    }
  }

  /**
   * Enable or disable auto-saving of cart states
   * @param {boolean} enabled Whether auto-saving should be enabled
   * @returns {Promise<void>}
   */
  async setCartAutoSaveEnabled(enabled) {
    try {
      const service = await this._getMementoService();
      service.setAutoSaveEnabled(enabled);
    } catch (err) {
      console.error('Failed to set cart auto-save:', err);
    }
  }
}

export default new CartService();
