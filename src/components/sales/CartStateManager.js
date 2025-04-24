import { CartService } from '../../services';

/**
 * Logs an error message to the console with context.
 * @param {string} context - The context where the error occurred (e.g., function name).
 * @param {Error} error - The error object.
 */
const logError = (context, error) => {
  console.error(`[CartStateManager:${context}]`, error);
};

/**
 * Adds a product to the cart, checking stock and saving state.
 * @param {Array<object>} cartItems - The current items in the cart.
 * @param {Array<object>} appliedVouchers - The currently applied vouchers.
 * @param {object} product - The product to add.
 * @param {Function} setCartItems - State setter function for cart items.
 * @param {Function} [showToast] - Optional function to display toast notifications.
 */
export const addToCart = (cartItems, appliedVouchers, product, setCartItems, showToast) => {
  const availableStock = product.currentStock ?? product.stockQuantity;

  if (availableStock <= 0) {
    showToast?.({
      severity: 'error',
      message: `${product.name} ist nicht mehr auf Lager.`,
    });
    return;
  }

  const existingItem = cartItems.find(item => item.id === product.id);
  const currentQuantity = existingItem ? existingItem.quantity : 0;

  if (currentQuantity >= availableStock) {
    showToast?.({
      severity: 'warning',
      message: `Kann ${product.name} nicht hinzufügen. Nur noch ${availableStock} auf Lager.`,
    });
    return;
  }

  const hasOutOfStockConnected = product.connectedProducts?.some(p => {
    const connectedStock = p.currentStock ?? p.stockQuantity;
    return p.category?.name !== 'Pfand' && connectedStock <= 0;
  });

  if (hasOutOfStockConnected) {
    showToast?.({
      severity: 'error',
      message: `${product.name} ist als Bundle nicht verfügbar, da Teile nicht lagernd sind.`,
    });
    return;
  }

  if (
    product.hasDiscount &&
    product.originalPrice !== undefined &&
    product.discountedPrice !== undefined
  ) {
    const originalPrice = parseFloat(product.originalPrice) || 0;
    const discountedPrice = parseFloat(product.discountedPrice) || 0;

    if (originalPrice > 0) {
      const discountAmount = originalPrice - discountedPrice;
      const discountPercentage = (discountAmount / originalPrice) * 100;

      if (discountPercentage > 50) {
        const reasonableDiscount = originalPrice * 0.5;
        product.discountedPrice = originalPrice - reasonableDiscount;
        product.discountPercentage = 50;
      }
    }
  }

  const updatedItems = CartService.addToCart([...cartItems], product);
  setCartItems(updatedItems);

  showToast?.({ severity: 'success', message: `${product.name} hinzugefügt` });

  CartService.saveCartState(updatedItems, appliedVouchers, 'Added product').catch(err =>
    logError('addToCart.saveState', err)
  );
};

/**
 * Removes one unit of a product from the cart and saves state.
 * @param {Array<object>} cartItems - The current items in the cart.
 * @param {Array<object>} appliedVouchers - The currently applied vouchers.
 * @param {string|number} productId - The ID of the product to remove one unit of.
 * @param {Function} setCartItems - State setter function for cart items.
 */
export const removeFromCart = (cartItems, appliedVouchers, productId, setCartItems) => {
  const updatedItems = CartService.removeFromCart([...cartItems], productId);
  setCartItems(updatedItems);

  CartService.saveCartState(updatedItems, appliedVouchers, 'Removed unit').catch(err =>
    logError('removeFromCart.saveState', err)
  );
};

/**
 * Deletes all units of a product from the cart and saves state.
 * @param {Array<object>} cartItems - The current items in the cart.
 * @param {Array<object>} appliedVouchers - The currently applied vouchers.
 * @param {string|number} productId - The ID of the product to delete.
 * @param {Function} setCartItems - State setter function for cart items.
 */
export const deleteFromCart = (cartItems, appliedVouchers, productId, setCartItems) => {
  const updatedItems = CartService.deleteFromCart([...cartItems], productId);
  setCartItems(updatedItems);

  CartService.saveCartState(updatedItems, appliedVouchers, 'Deleted product').catch(err =>
    logError('deleteFromCart.saveState', err)
  );
};

/**
 * Applies a voucher and saves cart state.
 * @param {Array<object>} cartItems - The current items in the cart.
 * @param {Array<object>} appliedVouchers - The currently applied vouchers.
 * @param {object} voucher - The voucher object to apply.
 * @param {Function} setAppliedVouchers - State setter function for applied vouchers.
 */
export const applyVoucher = (cartItems, appliedVouchers, voucher, setAppliedVouchers) => {
  if (appliedVouchers.some(v => v.id === voucher.id)) {
    console.warn(`Voucher ${voucher.id} is already applied.`);
    return;
  }
  const updatedVouchers = [...appliedVouchers, voucher];
  setAppliedVouchers(updatedVouchers);

  CartService.saveCartState(cartItems, updatedVouchers, 'Applied voucher').catch(err =>
    logError('applyVoucher.saveState', err)
  );
};

/**
 * Removes a voucher and saves cart state.
 * @param {Array<object>} cartItems - The current items in the cart.
 * @param {Array<object>} appliedVouchers - The currently applied vouchers.
 * @param {string|number} voucherId - The ID of the voucher to remove.
 * @param {Function} setAppliedVouchers - State setter function for applied vouchers.
 */
export const removeVoucher = (cartItems, appliedVouchers, voucherId, setAppliedVouchers) => {
  const updatedVouchers = appliedVouchers.filter(v => v.id !== voucherId);
  if (updatedVouchers.length < appliedVouchers.length) {
    setAppliedVouchers(updatedVouchers);
    CartService.saveCartState(cartItems, updatedVouchers, 'Removed voucher').catch(err =>
      logError('removeVoucher.saveState', err)
    );
  }
};

/**
 * Undoes the last cart state change.
 * @param {Function} setCartItems - State setter function for cart items.
 * @param {Function} setAppliedVouchers - State setter function for applied vouchers.
 */
export const undoCartState = async (setCartItems, setAppliedVouchers) => {
  try {
    const result = await CartService.undoCartState();
    if (result) {
      setCartItems(result.cartItems);
      setAppliedVouchers(result.appliedVouchers || []);
    }
  } catch (err) {
    logError('undoCartState', err);
  }
};

/**
 * Redoes the last undone cart state change.
 * @param {Function} setCartItems - State setter function for cart items.
 * @param {Function} setAppliedVouchers - State setter function for applied vouchers.
 */
export const redoCartState = async (setCartItems, setAppliedVouchers) => {
  try {
    const result = await CartService.redoCartState();
    if (result) {
      setCartItems(result.cartItems);
      setAppliedVouchers(result.appliedVouchers || []);
    }
  } catch (err) {
    logError('redoCartState', err);
  }
};

/**
 * Checks if an undo operation is available.
 * @returns {boolean} True if undo is possible, false otherwise.
 */
export const canUndoCartState = () => {
  try {
    return CartService.canUndoCartState();
  } catch (err) {
    logError('canUndoCartState', err);
    return false;
  }
};

/**
 * Checks if a redo operation is available.
 * @returns {boolean} True if redo is possible, false otherwise.
 */
export const canRedoCartState = () => {
  try {
    return CartService.canRedoCartState();
  } catch (err) {
    logError('canRedoCartState', err);
    return false;
  }
};

const initialCardDetails = {
  cardNumber: '',
  cardHolderName: '',
  expirationDate: '',
  cvv: '',
};

/**
 * Clears the cart, resets related state, and clears history.
 * @param {Function} setCartItems - State setter function for cart items.
 * @param {Function} setAppliedVouchers - State setter function for applied vouchers.
 * @param {Function} setAppliedDeposits - State setter function for applied deposits.
 * @param {Function} setVoucherDiscount - State setter function for voucher discount amount.
 * @param {Function} setDepositCredit - State setter function for deposit credit amount.
 * @param {Function} [setCardDetails] - Optional state setter for card details.
 * @param {Function} [resetOtherStates] - Optional callback for resetting other screen-specific states.
 */
export const clearCart = (
  setCartItems,
  setAppliedVouchers,
  setAppliedDeposits,
  setVoucherDiscount,
  setDepositCredit,
  setCardDetails,
  resetOtherStates
) => {
  setCartItems([]);
  setAppliedVouchers([]);
  setAppliedDeposits([]);
  setVoucherDiscount(0);
  setDepositCredit(0);

  setCardDetails?.(initialCardDetails);

  resetOtherStates?.();

  CartService.clearCartHistory().catch(err => {
    logError('clearCart.clearHistory', err);
  });
};
