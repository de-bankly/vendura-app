import { CartService } from '../../services';

/**
 * Handles adding a product to cart with background state saving
 */
export const addToCart = (cartItems, appliedVouchers, product, setCartItems) => {
  const updatedItems = CartService.addToCart([...cartItems], product);
  setCartItems(updatedItems);

  // Save state in background with explicit label
  CartService.saveCartState(updatedItems, appliedVouchers, 'Added product').catch(err => {
    console.error('Failed to save cart state after adding item:', err);
  });

  return updatedItems;
};

/**
 * Handles removing a product from cart with background state saving
 */
export const removeFromCart = (cartItems, appliedVouchers, productId, setCartItems) => {
  const updatedItems = CartService.removeFromCart([...cartItems], productId);
  setCartItems(updatedItems);

  // Save state in background with explicit label
  CartService.saveCartState(updatedItems, appliedVouchers, 'Removed product').catch(err => {
    console.error('Failed to save cart state after removing item:', err);
  });

  return updatedItems;
};

/**
 * Handles deleting a product from cart with background state saving
 */
export const deleteFromCart = (cartItems, appliedVouchers, productId, setCartItems) => {
  const updatedItems = CartService.deleteFromCart([...cartItems], productId);
  setCartItems(updatedItems);

  // Save state in background with explicit label
  CartService.saveCartState(updatedItems, appliedVouchers, 'Deleted product').catch(err => {
    console.error('Failed to save cart state after deleting item:', err);
  });

  return updatedItems;
};

/**
 * Handles applying a voucher to the cart with background state saving
 */
export const applyVoucher = (cartItems, appliedVouchers, voucher, setAppliedVouchers) => {
  const updatedVouchers = [...appliedVouchers, voucher];
  setAppliedVouchers(updatedVouchers);

  // Save state in background
  CartService.saveCartState(cartItems, updatedVouchers, 'Applied voucher').catch(err => {
    console.error('Failed to save cart state after applying voucher:', err);
  });

  return updatedVouchers;
};

/**
 * Handles removing a voucher from the cart with background state saving
 */
export const removeVoucher = (cartItems, appliedVouchers, voucherId, setAppliedVouchers) => {
  const updatedVouchers = appliedVouchers.filter(v => v.id !== voucherId);
  setAppliedVouchers(updatedVouchers);

  // Save state in background
  CartService.saveCartState(cartItems, updatedVouchers, 'Removed voucher').catch(err => {
    console.error('Failed to save cart state after removing voucher:', err);
  });

  return updatedVouchers;
};

/**
 * Handles undo cart state operation
 */
export const undoCartState = async (setCartItems, setAppliedVouchers) => {
  try {
    const result = await CartService.undoCartState();
    if (result) {
      setCartItems(result.cartItems);
      setAppliedVouchers(result.appliedVouchers || []);
    }
    return result;
  } catch (err) {
    console.error('Failed to undo cart state:', err);
    return null;
  }
};

/**
 * Handles redo cart state operation
 */
export const redoCartState = async (setCartItems, setAppliedVouchers) => {
  try {
    const result = await CartService.redoCartState();
    if (result) {
      setCartItems(result.cartItems);
      setAppliedVouchers(result.appliedVouchers || []);
    }
    return result;
  } catch (err) {
    console.error('Failed to redo cart state:', err);
    return null;
  }
};

/**
 * Check if undo is available for cart state
 * @returns {boolean} True if undo is available
 */
export const canUndoCartState = () => {
  try {
    return CartService.canUndoCartState();
  } catch (err) {
    console.error('Error checking if undo is available:', err);
    return false;
  }
};

/**
 * Check if redo is available for cart state
 * @returns {boolean} True if redo is available
 */
export const canRedoCartState = () => {
  try {
    return CartService.canRedoCartState();
  } catch (err) {
    console.error('Error checking if redo is available:', err);
    return false;
  }
};

/**
 * Clears the cart and resets all related state
 */
export const clearCart = (
  setCartItems,
  setAppliedVouchers,
  setAppliedDeposits,
  setVoucherDiscount,
  setDepositCredit,
  setCardDetails
) => {
  setCartItems([]);
  setAppliedVouchers([]);
  setAppliedDeposits([]);
  setVoucherDiscount(0);
  setDepositCredit(0);

  if (setCardDetails) {
    setCardDetails({
      cardNumber: '',
      cardHolderName: '',
      expirationDate: '',
      cvv: '',
    });
  }

  // Clear cart history in background
  CartService.clearCartHistory().catch(err => {
    console.error('Failed to clear cart history:', err);
  });
};
