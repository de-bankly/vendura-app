import CartMemento from './CartMemento';

/**
 * CartOriginator class
 * Represents the current state of the shopping cart and creates/restores mementos
 */
class CartOriginator {
  constructor() {
    this._cartItems = [];
    this._appliedVouchers = [];
  }

  /**
   * Set the current cart items
   * @param {Array} cartItems - The cart items to set
   */
  setCartItems(cartItems) {
    this._cartItems = cartItems;
  }

  /**
   * Get the current cart items
   * @returns {Array} The current cart items
   */
  getCartItems() {
    return this._cartItems;
  }

  /**
   * Set the current applied vouchers
   * @param {Array} appliedVouchers - The applied vouchers to set
   */
  setAppliedVouchers(appliedVouchers) {
    this._appliedVouchers = appliedVouchers;
  }

  /**
   * Get the current applied vouchers
   * @returns {Array} The current applied vouchers
   */
  getAppliedVouchers() {
    return this._appliedVouchers;
  }

  /**
   * Create a memento of the current state
   * @returns {CartMemento} A memento containing the current state
   */
  saveToMemento() {
    return new CartMemento(this._cartItems, this._appliedVouchers);
  }

  /**
   * Restore state from a memento
   * @param {CartMemento} memento - The memento to restore from
   */
  restoreFromMemento(memento) {
    if (memento) {
      this._cartItems = JSON.parse(JSON.stringify(memento.getCartItems()));
      this._appliedVouchers = JSON.parse(JSON.stringify(memento.getAppliedVouchers()));
    }
  }
}

export default CartOriginator;
