import CartCareTaker from './CartCareTaker';
import CartOriginator from './CartOriginator';

/**
 * Service integrating the Memento pattern for cart state management.
 * Provides functionality to save, restore (undo/redo), and manage cart states.
 */
class CartMementoService {
  constructor() {
    this._originator = new CartOriginator();
    this._careTaker = new CartCareTaker();
    this._autoSaveEnabled = true;
    this._autoSaveThreshold = 2000; // Default threshold in ms
    this._lastSaveTimestamp = 0;
    this._pendingSaveTimeout = null;
  }

  /**
   * Updates the cart items in the originator and schedules an auto-save if enabled.
   * @param {Array} cartItems - The new array of cart items.
   * @returns {Array} The updated cart items, or an empty array if input was falsy.
   */
  updateCartItems(cartItems) {
    if (!cartItems) return [];
    this._originator.setCartItems(cartItems);
    this._scheduleAutoSave();
    return cartItems;
  }

  /**
   * Updates the applied vouchers in the originator and schedules an auto-save if enabled.
   * @param {Array} appliedVouchers - The new array of applied vouchers. Defaults to empty array if falsy.
   * @returns {Array} The updated applied vouchers.
   */
  updateAppliedVouchers(appliedVouchers) {
    const vouchers = appliedVouchers || [];
    this._originator.setAppliedVouchers(vouchers);
    this._scheduleAutoSave();
    return vouchers;
  }

  /**
   * Gets the current cart items from the originator.
   * @returns {Array} The current array of cart items.
   */
  getCartItems() {
    return this._originator.getCartItems();
  }

  /**
   * Gets the current applied vouchers from the originator.
   * @returns {Array} The current array of applied vouchers.
   */
  getAppliedVouchers() {
    return this._originator.getAppliedVouchers();
  }

  /**
   * Manually saves the current state to a memento.
   * Does not save if the cart is empty. Clears any pending auto-save.
   * @param {string} [label=null] - An optional label to identify the saved state.
   * @returns {boolean} True if the state was saved successfully (cart not empty), false otherwise.
   */
  saveState(label = null) {
    const cartItems = this._originator.getCartItems();
    if (!cartItems || cartItems.length === 0) {
      return false;
    }

    if (this._pendingSaveTimeout) {
      clearTimeout(this._pendingSaveTimeout);
      this._pendingSaveTimeout = null;
    }

    const memento = this._originator.saveToMemento();
    if (label) {
      memento.label = label;
    }

    this._careTaker.addMemento(memento);
    this._lastSaveTimestamp = Date.now();
    return true;
  }

  /**
   * Restores the previous state from the history (undo).
   * @returns {{cartItems: Array, appliedVouchers: Array}|null} An object containing the restored state ({cartItems, appliedVouchers}), or null if no previous state exists.
   */
  undo() {
    const previousMemento = this._careTaker.getPreviousMemento();
    if (previousMemento) {
      this._originator.restoreFromMemento(previousMemento);
      return {
        cartItems: this._originator.getCartItems(),
        appliedVouchers: this._originator.getAppliedVouchers(),
      };
    }
    return null;
  }

  /**
   * Restores the next state from the history (redo), if available after an undo.
   * @returns {{cartItems: Array, appliedVouchers: Array}|null} An object containing the restored state ({cartItems, appliedVouchers}), or null if no next state exists.
   */
  redo() {
    const nextMemento = this._careTaker.getNextMemento();
    if (nextMemento) {
      this._originator.restoreFromMemento(nextMemento);
      return {
        cartItems: this._originator.getCartItems(),
        appliedVouchers: this._originator.getAppliedVouchers(),
      };
    }
    return null;
  }

  /**
   * Checks if an undo operation is possible (if there is a previous state in history).
   * @returns {boolean} True if undo is available, false otherwise.
   */
  canUndo() {
    return this._careTaker.canUndo();
  }

  /**
   * Checks if a redo operation is possible (if there is a next state in history).
   * @returns {boolean} True if redo is available, false otherwise.
   */
  canRedo() {
    return this._careTaker.canRedo();
  }

  /**
   * Restores state from a specific memento by its index in the history.
   * @param {number} index - The index of the memento to restore.
   * @returns {{cartItems: Array, appliedVouchers: Array}|null} An object containing the restored state ({cartItems, appliedVouchers}), or null if the index is invalid.
   */
  restoreStateByIndex(index) {
    const memento = this._careTaker.getMemento(index);
    if (memento) {
      this._originator.restoreFromMemento(memento);
      return {
        cartItems: this._originator.getCartItems(),
        appliedVouchers: this._originator.getAppliedVouchers(),
      };
    }
    return null;
  }

  /**
   * Gets all saved mementos (states) currently stored in the history.
   * @returns {Array} Array of all saved mementos.
   */
  getAllSavedStates() {
    return this._careTaker.getAllMementos();
  }

  /**
   * Clears all saved states from the history and resets the current originator state to empty.
   */
  clearHistory() {
    this._careTaker.clear();
    this._originator.setCartItems([]);
    this._originator.setAppliedVouchers([]);
    this._lastSaveTimestamp = 0; // Reset timestamp as history is cleared
    if (this._pendingSaveTimeout) {
      clearTimeout(this._pendingSaveTimeout);
      this._pendingSaveTimeout = null;
    }
  }

  /**
   * Enables or disables the auto-save feature.
   * @param {boolean} enabled - True to enable auto-saving, false to disable.
   */
  setAutoSaveEnabled(enabled) {
    this._autoSaveEnabled = enabled;
    if (!enabled && this._pendingSaveTimeout) {
      // Clear pending save if auto-save is disabled
      clearTimeout(this._pendingSaveTimeout);
      this._pendingSaveTimeout = null;
    }
  }

  /**
   * Sets the minimum time interval (in milliseconds) between automatic saves.
   * This prevents excessive saves during rapid state changes.
   * @param {number} threshold - The time threshold in milliseconds (e.g., 2000 for 2 seconds).
   */
  setAutoSaveThreshold(threshold) {
    this._autoSaveThreshold = threshold;
  }

  /**
   * Schedules an automatic save operation if auto-save is enabled and the cart is not empty.
   * Uses a threshold to debounce rapid changes, ensuring saves don't happen too frequently.
   * Clears any previously scheduled auto-save before setting a new one.
   * @private
   */
  _scheduleAutoSave() {
    if (!this._autoSaveEnabled) {
      return;
    }

    const cartItems = this._originator.getCartItems();
    if (!cartItems || cartItems.length === 0) {
      // Don't schedule auto-save for an empty cart state
      // Clear pending save if cart becomes empty
      if (this._pendingSaveTimeout) {
        clearTimeout(this._pendingSaveTimeout);
        this._pendingSaveTimeout = null;
      }
      return;
    }

    if (this._pendingSaveTimeout) {
      clearTimeout(this._pendingSaveTimeout);
    }

    const timeSinceLastSave = Date.now() - this._lastSaveTimestamp;
    const timeToWait = Math.max(0, this._autoSaveThreshold - timeSinceLastSave);

    this._pendingSaveTimeout = setTimeout(() => {
      this.saveState(); // Use the public saveState method
      this._pendingSaveTimeout = null; // Clear the timeout ID after execution
    }, timeToWait);
  }
}

export default new CartMementoService();
