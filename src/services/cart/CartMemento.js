/**
 * CartMemento class
 * Responsible for storing a snapshot of the shopping cart state
 */
class CartMemento {
  /**
   * Create a new cart memento
   * @param {Array} cartItems - The cart items to save
   * @param {Array} appliedVouchers - The applied vouchers to save
   * @param {string} timestamp - When the memento was created
   */
  constructor(cartItems, appliedVouchers, timestamp = new Date().toISOString()) {
    this._cartItems = JSON.parse(JSON.stringify(cartItems));
    this._appliedVouchers = JSON.parse(JSON.stringify(appliedVouchers || []));
    this._timestamp = timestamp;
  }

  /**
   * Get the saved cart items
   * @returns {Array} The cart items
   */
  getCartItems() {
    return this._cartItems;
  }

  /**
   * Get the saved applied vouchers
   * @returns {Array} The applied vouchers
   */
  getAppliedVouchers() {
    return this._appliedVouchers;
  }

  /**
   * Get the timestamp when this memento was created
   * @returns {string} ISO timestamp
   */
  getTimestamp() {
    return this._timestamp;
  }

  /**
   * Get a label for this memento (for UI display if needed)
   * @returns {string} A human-readable label for this memento
   */
  getLabel() {
    const date = new Date(this._timestamp);
    const formattedDate = date.toLocaleString();
    const itemCount = this._cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return `${formattedDate} (${itemCount} Artikel)`;
  }
}

export default CartMemento;
