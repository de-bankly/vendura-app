import { CartService } from '../../services';

// Centralized error logger (can be replaced with a proper logging service)
const logError = (context, error) => {
  console.error(`[CartStateManager:${context}]`, error);
  // TODO: Integrate with a proper logging service if available
};

/**
 * Adds a product to the cart, checking stock and saving state.
 */
export const addToCart = (cartItems, appliedVouchers, product, setCartItems, showToast) => {
  const availableStock = product.currentStock ?? product.stockQuantity;

  if (availableStock <= 0) {
    showToast?.({ severity: 'error', message: `${product.name} ist nicht mehr auf Lager.` });
    return; // Exit without changing state
  }

  const existingItem = cartItems.find(item => item.id === product.id);
  const currentQuantity = existingItem ? existingItem.quantity : 0;

  if (currentQuantity >= availableStock) {
    showToast?.({
      severity: 'warning',
      message: `Kann ${product.name} nicht hinzufügen. Nur noch ${availableStock} auf Lager.`,
    });
    return; // Exit without changing state
  }

  // Check connected product stock (excluding 'Pfand')
  const hasOutOfStockConnected = product.connectedProducts?.some(p => {
    const connectedStock = p.currentStock ?? p.stockQuantity;
    return p.category?.name !== 'Pfand' && connectedStock <= 0;
  });

  if (hasOutOfStockConnected) {
    showToast?.({
      severity: 'error',
      message: `${product.name} ist als Bundle nicht verfügbar, da Teile nicht lagernd sind.`,
    });
    return; // Exit without changing state
  }

  // Validate product discount information
  if (
    product.hasDiscount &&
    product.originalPrice !== undefined &&
    product.discountedPrice !== undefined
  ) {
    const originalPrice = parseFloat(product.originalPrice) || 0;
    const discountedPrice = parseFloat(product.discountedPrice) || 0;

    // Check if discount seems unreasonable (more than 50% of original price)
    if (originalPrice > 0) {
      const discountAmount = originalPrice - discountedPrice;
      const discountPercentage = (discountAmount / originalPrice) * 100;

      if (discountPercentage > 50) {
        // Fix the discount to a reasonable amount (50%)
        const reasonableDiscount = originalPrice * 0.5;
        product.discountedPrice = originalPrice - reasonableDiscount;
        product.discountPercentage = 50;
      }
    }
  }

  // All checks passed, update cart
  const updatedItems = CartService.addToCart([...cartItems], product);
  setCartItems(updatedItems);

  showToast?.({ severity: 'success', message: `${product.name} hinzugefügt` });

  CartService.saveCartState(updatedItems, appliedVouchers, 'Added product').catch(err =>
    logError('addToCart.saveState', err)
  );
};

/**
 * Removes one unit of a product from the cart and saves state.
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
 */
export const applyVoucher = (cartItems, appliedVouchers, voucher, setAppliedVouchers) => {
  // Prevent adding duplicate vouchers
  if (appliedVouchers.some(v => v.id === voucher.id)) {
    // Optional: show a toast message here if needed
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
 */
export const removeVoucher = (cartItems, appliedVouchers, voucherId, setAppliedVouchers) => {
  const updatedVouchers = appliedVouchers.filter(v => v.id !== voucherId);
  // Only update state and save if a voucher was actually removed
  if (updatedVouchers.length < appliedVouchers.length) {
    setAppliedVouchers(updatedVouchers);
    CartService.saveCartState(cartItems, updatedVouchers, 'Removed voucher').catch(err =>
      logError('removeVoucher.saveState', err)
    );
  }
};

/**
 * Undoes the last cart state change.
 */
export const undoCartState = async (setCartItems, setAppliedVouchers) => {
  try {
    const result = await CartService.undoCartState();
    if (result) {
      setCartItems(result.cartItems);
      setAppliedVouchers(result.appliedVouchers || []); // Ensure array
    }
    // Optionally return result or boolean indicating success
  } catch (err) {
    logError('undoCartState', err);
    // Optionally show a toast to the user
  }
};

/**
 * Redoes the last undone cart state change.
 */
export const redoCartState = async (setCartItems, setAppliedVouchers) => {
  try {
    const result = await CartService.redoCartState();
    if (result) {
      setCartItems(result.cartItems);
      setAppliedVouchers(result.appliedVouchers || []); // Ensure array
    }
    // Optionally return result or boolean indicating success
  } catch (err) {
    logError('redoCartState', err);
    // Optionally show a toast to the user
  }
};

/**
 * Checks if an undo operation is available.
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
 */
export const clearCart = (
  setCartItems,
  setAppliedVouchers,
  setAppliedDeposits, // Keep if deposits are managed outside vouchers/items
  setVoucherDiscount,
  setDepositCredit,
  setCardDetails, // Make optional if card details aren't always cleared
  resetOtherStates // Optional callback for other screen-specific resets
) => {
  setCartItems([]);
  setAppliedVouchers([]);
  setAppliedDeposits([]); // Reset deposits
  setVoucherDiscount(0); // Reset calculated discounts/credits
  setDepositCredit(0);

  // Only reset card details if the setter is provided
  setCardDetails?.(initialCardDetails);

  // Allow parent component to reset other specific states
  resetOtherStates?.();

  CartService.clearCartHistory().catch(err => {
    logError('clearCart.clearHistory', err);
  });
};
