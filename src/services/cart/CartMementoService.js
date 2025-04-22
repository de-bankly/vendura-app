import CartCareTaker from './CartCareTaker';
import CartOriginator from './CartOriginator';

/**
 * CartMementoService
 * Service that integrates the Memento pattern for cart state management
 */
class CartMementoService {
  constructor() {
    this._originator = new CartOriginator();
    this._careTaker = new CartCareTaker();
    this._autoSaveEnabled = true;
    this._autoSaveThreshold = 2000; // Time in ms between auto-saves (prevents too many saves on rapid changes)
    this._lastSaveTimestamp = 0;
    this._pendingSaveTimeout = null;
  }

  /**
   * Update the cart items in the originator and trigger auto-save if enabled
   * @param {Array} cartItems - The new cart items
   */
  updateCartItems(cartItems) {
    if (!cartItems) return [];
    this._originator.setCartItems(cartItems);
    this._scheduleAutoSave();
    return cartItems;
  }

  /**
   * Update the applied vouchers in the originator and trigger auto-save if enabled
   * @param {Array} appliedVouchers - The new applied vouchers
   */
  updateAppliedVouchers(appliedVouchers) {
    this._originator.setAppliedVouchers(appliedVouchers || []);
    this._scheduleAutoSave();
    return appliedVouchers || [];
  }

  /**
   * Get the current cart items from the originator
   * @returns {Array} The current cart items
   */
  getCartItems() {
    return this._originator.getCartItems();
  }

  /**
   * Get the current applied vouchers from the originator
   * @returns {Array} The current applied vouchers
   */
  getAppliedVouchers() {
    return this._originator.getAppliedVouchers();
  }

  /**
   * Manually save the current state to a memento
   * @param {string} label - Optional label for the memento
   * @returns {boolean} True if the save was successful
   */
  saveState(label = null) {
    // Check if there are cart items before saving
    const cartItems = this._originator.getCartItems();
    if (!cartItems || cartItems.length === 0) {
      return false;
    }

    // Clear any pending auto-save
    if (this._pendingSaveTimeout) {
      clearTimeout(this._pendingSaveTimeout);
      this._pendingSaveTimeout = null;
    }

    // Save the current state
    const memento = this._originator.saveToMemento();
    if (label) {
      memento.label = label;
    }

    this._careTaker.addMemento(memento);
    this._lastSaveTimestamp = Date.now();
    return true;
  }

  /**
   * Restore a previous state (undo)
   * @returns {Object|null} An object containing the restored state, or null if restore failed
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
   * Restore a next state (redo)
   * @returns {Object|null} An object containing the restored state, or null if restore failed
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
   * Check if undo is available
   * @returns {boolean} True if undo is available
   */
  canUndo() {
    return this._careTaker.canUndo();
  }

  /**
   * Check if redo is available
   * @returns {boolean} True if redo is available
   */
  canRedo() {
    return this._careTaker.canRedo();
  }

  /**
   * Restore state from a specific memento by index
   * @param {number} index - The index of the memento to restore
   * @returns {Object|null} An object containing the restored state, or null if restore failed
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
   * Get all saved states
   * @returns {Array} Array of all saved mementos
   */
  getAllSavedStates() {
    return this._careTaker.getAllMementos();
  }

  /**
   * Clear all saved states
   */
  clearHistory() {
    this._careTaker.clear();
    // Also reset the current state
    this._originator.setCartItems([]);
    this._originator.setAppliedVouchers([]);
  }

  /**
   * Enable or disable auto-saving
   * @param {boolean} enabled - Whether auto-saving should be enabled
   */
  setAutoSaveEnabled(enabled) {
    this._autoSaveEnabled = enabled;
  }

  /**
   * Set the auto-save threshold (to prevent too many saves on rapid changes)
   * @param {number} threshold - Time in ms between auto-saves
   */
  setAutoSaveThreshold(threshold) {
    this._autoSaveThreshold = threshold;
  }

  /**
   * Schedule an auto-save if auto-save is enabled
   * @private
   */
  _scheduleAutoSave() {
    // Only schedule an auto-save if enabled
    if (!this._autoSaveEnabled) {
      return;
    }

    // Check if there are cart items before scheduling an auto-save
    const cartItems = this._originator.getCartItems();
    if (!cartItems || cartItems.length === 0) {
      return;
    }

    // Clear any existing timeout
    if (this._pendingSaveTimeout) {
      clearTimeout(this._pendingSaveTimeout);
    }

    // Calculate how long to wait before auto-saving
    const timeSinceLastSave = Date.now() - this._lastSaveTimestamp;
    const timeToWait = Math.max(0, this._autoSaveThreshold - timeSinceLastSave);

    // Schedule the auto-save
    this._pendingSaveTimeout = setTimeout(() => {
      this.saveState();
      this._pendingSaveTimeout = null;
    }, timeToWait);
  }
}

export default new CartMementoService();
