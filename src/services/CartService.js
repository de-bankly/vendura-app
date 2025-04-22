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
          // Create a copy with additional property to mark it as a connected product
          const connectedProductWithParent = {
            ...connectedProduct,
            quantity: 1,
            isConnectedProduct: true,
            parentProductId: product.id,
          };

          updatedCartItems.push(connectedProductWithParent);
        });
      }
    }

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

    // If it's a connected product, don't remove it
    if (itemToRemove && itemToRemove.isConnectedProduct) {
      return cartItems;
    }

    // Handle parent product removal
    if (itemToRemove && !itemToRemove.isConnectedProduct) {
      let updatedCartItems = [...cartItems];

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

          // Remove connected products with zero quantity
          updatedCartItems = updatedCartItems.filter(item => item.quantity > 0);
        }
      } else {
        // Remove the parent product and all its connected products
        updatedCartItems = updatedCartItems.filter(
          item => item.id !== productId && item.parentProductId !== productId
        );
      }

      return updatedCartItems;
    }

    // Handle normal products
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
   * @param {string} productId ID of product to delete
   * @returns {Array} Updated cart items
   */
  deleteFromCart(cartItems, productId) {
    // Find the item to delete
    const itemToDelete = cartItems.find(item => item.id === productId);

    // If it's a connected product, don't allow deletion
    if (itemToDelete && itemToDelete.isConnectedProduct) {
      return cartItems;
    }

    // If it's a parent product, delete it and all its connected products
    if (itemToDelete && !itemToDelete.isConnectedProduct) {
      return cartItems.filter(item => item.id !== productId && item.parentProductId !== productId);
    }

    // Default case: normal product deletion
    return cartItems.filter(item => item.id !== productId);
  }

  /**
   * Check if an item in the cart is removable
   * @param {Object} cartItem The cart item to check
   * @returns {boolean} Whether the item can be removed
   */
  isItemRemovable(cartItem) {
    return !cartItem.isConnectedProduct;
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

      // Add connected product information if it's a connected product
      if (item.isConnectedProduct && item.parentProductId) {
        formattedItem.isConnectedProduct = true;
        formattedItem.parentProductId = item.parentProductId;
      }

      return formattedItem;
    });
  }
}

export default new CartService();
