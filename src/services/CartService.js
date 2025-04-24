import('./cart/CartMementoService'); // Keep dynamic import hint for bundlers if needed

/**
 * Service for managing shopping cart operations.
 * Utilizes a Memento pattern via CartMementoService for state management (undo/redo).
 */
class CartService {
  /**
   * Initializes the CartService.
   */
  constructor() {
    this._mementoService = null;
    this._mementoServicePromise = null;
  }

  /**
   * Lazily loads and returns the CartMementoService instance.
   * @returns {Promise<import('./cart/CartMementoService').default>} The memento service instance.
   * @private
   */
  async _getMementoService() {
    if (!this._mementoService) {
      if (!this._mementoServicePromise) {
        this._mementoServicePromise = import('./cart/CartMementoService').then(module => {
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
   * Adds a product to the cart or increments its quantity.
   * Handles parent products and their connected products (e.g., Pfand/deposit).
   * Pfand products cannot be added individually or have their quantity incremented directly.
   * @param {Array<Object>} cartItems - Current cart items.
   * @param {Object} product - Product to add.
   * @returns {Array<Object>} Updated cart items.
   */
  addToCart(cartItems, product) {
    let updatedCartItems = [...cartItems];
    const existingItem = updatedCartItems.find(item => item.id === product.id);

    if (existingItem) {
      const isPfandProduct =
        existingItem.isPfandProduct === true || existingItem.category?.name === 'Pfand';

      if (isPfandProduct) {
        return cartItems; // Pfand items quantity tied to parent
      }

      updatedCartItems = updatedCartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );

      if (product.connectedProducts && product.connectedProducts.length > 0) {
        for (const connectedProduct of product.connectedProducts) {
          const existingConnectedItem = updatedCartItems.find(
            item => item.id === connectedProduct.id && item.parentProductId === product.id
          );

          if (existingConnectedItem) {
            // Update connected product quantity to match parent
            updatedCartItems = updatedCartItems.map(item =>
              item.id === connectedProduct.id && item.parentProductId === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }
        }
      }
    } else {
      updatedCartItems.push({ ...product, quantity: 1 });

      if (product.connectedProducts && product.connectedProducts.length > 0) {
        product.connectedProducts.forEach(connectedProduct => {
          const isPfandProduct = connectedProduct?.category?.name === 'Pfand';
          const connectedProductWithParent = {
            ...connectedProduct,
            quantity: 1,
            isConnectedProduct: true,
            isPfandProduct: isPfandProduct,
            parentProductId: product.id,
          };
          updatedCartItems.push(connectedProductWithParent);
        });
      }
    }

    this._updateMementoServiceAsync(updatedCartItems);
    return updatedCartItems;
  }

  /**
   * Decrements a product's quantity or removes it if quantity is 1.
   * Prevents direct removal/decrement of connected or Pfand products.
   * Handles parent products and their connected products accordingly.
   * @param {Array<Object>} cartItems - Current cart items.
   * @param {string} productId - ID of the product to remove/decrement.
   * @returns {Array<Object>} Updated cart items.
   */
  removeFromCart(cartItems, productId) {
    const itemToRemove = cartItems.find(item => item.id === productId);
    let updatedCartItems = [...cartItems];

    if (itemToRemove && (itemToRemove.isConnectedProduct || itemToRemove.isPfandProduct)) {
      return cartItems; // Cannot directly remove connected/Pfand items
    }

    if (itemToRemove && !itemToRemove.isConnectedProduct) {
      // Handle parent product
      if (itemToRemove.quantity > 1) {
        updatedCartItems = updatedCartItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );

        // Decrement connected products
        updatedCartItems = updatedCartItems.map(item =>
          item.parentProductId === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
        // Clean up any connected items that might reach zero (should align with parent)
        updatedCartItems = updatedCartItems.filter(
          item => item.quantity > 0 || item.parentProductId !== productId
        );
      } else {
        // Remove parent and all connected products
        updatedCartItems = updatedCartItems.filter(
          item => item.id !== productId && item.parentProductId !== productId
        );
      }
    } else if (itemToRemove) {
      // Handle regular product (not parent, not connected/pfand)
      if (itemToRemove.quantity > 1) {
        updatedCartItems = cartItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        updatedCartItems = cartItems.filter(item => item.id !== productId);
      }
    }
    // If itemToRemove was not found, updatedCartItems remains a copy of cartItems

    this._updateMementoServiceAsync(updatedCartItems);
    return updatedCartItems;
  }

  /**
   * Deletes a product from the cart entirely, regardless of quantity.
   * Prevents direct deletion of connected or Pfand products.
   * If a parent product is deleted, its connected products are also deleted.
   * @param {Array<Object>} cartItems - Current cart items.
   * @param {string} productId - ID of the product to delete.
   * @returns {Array<Object>} Updated cart items.
   */
  deleteFromCart(cartItems, productId) {
    const itemToDelete = cartItems.find(item => item.id === productId);
    let updatedCartItems = [...cartItems];

    if (itemToDelete && (itemToDelete.isConnectedProduct || itemToDelete.isPfandProduct)) {
      return cartItems; // Cannot directly delete connected/Pfand items
    }

    if (itemToDelete && !itemToDelete.isConnectedProduct) {
      // Delete parent and all connected products
      updatedCartItems = cartItems.filter(
        item => item.id !== productId && item.parentProductId !== productId
      );
    } else {
      // Delete regular product (or if item not found)
      updatedCartItems = cartItems.filter(item => item.id !== productId);
    }

    this._updateMementoServiceAsync(updatedCartItems);
    return updatedCartItems;
  }

  /**
   * Updates the CartMementoService with the current cart items asynchronously.
   * This is a "fire and forget" operation to avoid blocking UI updates.
   * @param {Array<Object>} cartItems - Cart items to save in the memento state.
   * @private
   */
  _updateMementoServiceAsync(cartItems) {
    this._getMementoService()
      .then(service => {
        service.updateCartItems(cartItems);
      })
      .catch(err => {
        console.error('Failed to update cart memento:', err);
      });
  }

  /**
   * Checks if a specific cart item can be directly removed or deleted by the user.
   * Users can only interact directly with items that are not connected or Pfand products.
   * @param {Object} cartItem - The cart item to check.
   * @returns {boolean} True if the item is removable/deletable via UI controls.
   */
  isItemRemovable(cartItem) {
    return !cartItem.isConnectedProduct && !cartItem.isPfandProduct;
  }

  /**
   * Calculates the subtotal of all items in the cart, considering discounts.
   * @param {Array<Object>} cartItems - Cart items.
   * @returns {number} The calculated subtotal.
   */
  calculateSubtotal(cartItems) {
    return cartItems.reduce((sum, item) => {
      const price = this.getItemEffectivePrice(item);
      const quantity = parseInt(item.quantity) || 0;
      return sum + price * quantity;
    }, 0);
  }

  /**
   * Gets the effective price for a single cart item, considering potential discounts.
   * @param {Object} item - The cart item.
   * @returns {number} The effective price (discounted price if available, otherwise regular price).
   */
  getItemEffectivePrice(item) {
    if (item.hasDiscount && item.discountedPrice !== undefined) {
      return parseFloat(item.discountedPrice) || 0;
    }
    return parseFloat(item.price) || 0;
  }

  /**
   * Calculates the total discount amount applied across all cart items.
   * Compares originalPrice and discountedPrice for items marked with hasDiscount.
   * Includes safety checks for valid prices and caps discount per item.
   * @param {Array<Object>} cartItems - Cart items.
   * @returns {number} The total discount amount.
   */
  calculateTotalDiscount(cartItems) {
    return cartItems.reduce((sum, item) => {
      if (
        item.hasDiscount &&
        item.originalPrice !== undefined &&
        item.discountedPrice !== undefined
      ) {
        const originalPrice = parseFloat(item.originalPrice) || 0;
        const discountedPrice = parseFloat(item.discountedPrice) || 0;

        if (originalPrice <= 0) {
          return sum; // Skip items with invalid original price
        }

        let discountPerItem = Math.max(0, originalPrice - discountedPrice);
        const maxDiscount = originalPrice * 0.5; // Safety cap
        discountPerItem = Math.min(discountPerItem, maxDiscount);

        const quantity = parseInt(item.quantity) || 0;
        return sum + discountPerItem * quantity;
      }
      return sum;
    }, 0);
  }

  /**
   * Calculates the total discount amount from applied vouchers.
   * @param {Array<Object>} vouchers - Applied vouchers, each expected to have a 'value' property.
   * @returns {number} Total discount from vouchers.
   */
  calculateVoucherDiscount(vouchers) {
    return vouchers.reduce((sum, voucher) => {
      const discountAmount = parseFloat(voucher.value) || 0;
      return sum + discountAmount;
    }, 0);
  }

  /**
   * Calculates the final total after applying voucher discounts to the subtotal.
   * Ensures the total does not go below zero.
   * @param {number} subtotal - The cart subtotal (after item discounts).
   * @param {number} voucherDiscount - The total discount from vouchers.
   * @returns {number} The final total amount.
   */
  calculateTotal(subtotal, voucherDiscount) {
    return Math.max(0, subtotal - voucherDiscount);
  }

  /**
   * Formats cart items for submission (e.g., to an API endpoint for sale processing).
   * Includes essential details like ID, quantity, and calculated discount amounts per line item.
   * Also includes flags for connected and Pfand products.
   * @param {Array<Object>} cartItems - Cart items.
   * @returns {Array<Object>} Formatted cart items suitable for sale submission.
   */
  formatCartItemsForSale(cartItems) {
    return cartItems.map(item => {
      const formattedItem = {
        id: item.id,
        quantity: item.quantity,
      };

      if (
        item.hasDiscount &&
        item.originalPrice !== undefined &&
        item.discountedPrice !== undefined
      ) {
        const originalPrice = parseFloat(item.originalPrice) || 0;
        const discountedPrice = parseFloat(item.discountedPrice) || 0;
        const discountAmount = Math.max(0, originalPrice - discountedPrice);
        if (discountAmount > 0) {
          // Total discount for the quantity of this specific item line
          formattedItem.discountEuro = discountAmount * item.quantity;
        }
      }

      if (item.isConnectedProduct && item.parentProductId) {
        formattedItem.isConnectedProduct = true;
        formattedItem.parentProductId = item.parentProductId;
      }

      if (item.isPfandProduct) {
        formattedItem.isPfandProduct = true;
      }

      return formattedItem;
    });
  }

  /**
   * Saves the current state of the cart (items and vouchers) using the MementoService.
   * @param {Array<Object>} cartItems - Current cart items.
   * @param {Array<Object>} appliedVouchers - Current applied vouchers.
   * @param {string} [label=null] - Optional label for the saved state.
   * @returns {Promise<boolean>} Promise resolving to true if save was successful, false otherwise.
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
   * Reverts the cart to the previous saved state (undo).
   * @returns {Promise<Object|null>} Promise resolving to an object containing the restored { cartItems, appliedVouchers }, or null if undo failed or not possible.
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
   * Re-applies a previously undone cart state (redo).
   * @returns {Promise<Object|null>} Promise resolving to an object containing the restored { cartItems, appliedVouchers }, or null if redo failed or not possible.
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
   * Checks if an undo operation is currently possible.
   * Requires the MementoService to be loaded.
   * @returns {boolean} True if undo is available, false otherwise.
   */
  canUndoCartState() {
    if (!this._mementoService) {
      this._getMementoService().catch(err => {
        console.error('Background load failed for canUndoCartState check:', err);
      });
      return false; // Service not ready yet
    }
    return this._mementoService.canUndo();
  }

  /**
   * Checks if a redo operation is currently possible.
   * Requires the MementoService to be loaded.
   * @returns {boolean} True if redo is available, false otherwise.
   */
  canRedoCartState() {
    if (!this._mementoService) {
      this._getMementoService().catch(err => {
        console.error('Background load failed for canRedoCartState check:', err);
      });
      return false; // Service not ready yet
    }
    return this._mementoService.canRedo();
  }

  /**
   * Retrieves all saved cart states from the MementoService.
   * @returns {Promise<Array<Object>>} Promise resolving to an array of saved cart state objects (each potentially having a label and timestamp).
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
   * Restores the cart to a specific saved state identified by its index.
   * @param {number} index - The index of the saved state to restore.
   * @returns {Promise<Object|null>} Promise resolving to an object containing the restored { cartItems, appliedVouchers }, or null if restore failed.
   */
  async restoreCartState(index) {
    try {
      const service = await this._getMementoService();
      return service.restoreStateByIndex(index);
    } catch (err) {
      console.error('Failed to restore cart state by index:', err);
      return null;
    }
  }

  /**
   * Clears the entire cart history (undo/redo stack and saved states) from the MementoService.
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
   * Enables or disables the auto-save feature in the MementoService.
   * @param {boolean} enabled - True to enable auto-saving, false to disable.
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
