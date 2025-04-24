/**
 * CartCareTaker class
 * Responsible for managing cart mementos (saving and restoring cart states)
 */
class CartCareTaker {
  /**
   * Initializes the CartCareTaker.
   */
  constructor() {
    /** @private */
    this._mementos = [];
    /** @private */
    this._currentIndex = -1;
    /** @private */
    this._maxMementos = 10;
  }

  /**
   * Save a new cart state. If the current index is not the last one,
   * it removes subsequent mementos before adding the new one.
   * Enforces a maximum number of mementos.
   * @param {CartMemento} memento - The memento to save.
   */
  addMemento(memento) {
    if (this._currentIndex < this._mementos.length - 1) {
      this._mementos = this._mementos.slice(0, this._currentIndex + 1);
    }

    this._mementos.push(memento);

    if (this._mementos.length > this._maxMementos) {
      this._mementos.shift();
    }

    this._currentIndex = this._mementos.length - 1;
  }

  /**
   * Get the memento at the specified index.
   * @param {number} index - The index of the memento to get.
   * @returns {CartMemento|null} The memento at the specified index, or null if index is invalid.
   */
  getMemento(index) {
    if (index >= 0 && index < this._mementos.length) {
      return this._mementos[index];
    }
    return null;
  }

  /**
   * Get all saved mementos.
   * @returns {Array<CartMemento>} A copy of all saved mementos.
   */
  getAllMementos() {
    return [...this._mementos];
  }

  /**
   * Get the total number of saved mementos.
   * @returns {number} The number of saved mementos.
   */
  getMementoCount() {
    return this._mementos.length;
  }

  /**
   * Get the previous memento and update the current index (for undo functionality).
   * @returns {CartMemento|null} The previous memento, or null if there is no previous memento.
   */
  getPreviousMemento() {
    if (this.canUndo()) {
      this._currentIndex--;
      return this._mementos[this._currentIndex];
    }
    return null;
  }

  /**
   * Get the next memento and update the current index (for redo functionality).
   * @returns {CartMemento|null} The next memento, or null if there is no next memento.
   */
  getNextMemento() {
    if (this.canRedo()) {
      this._currentIndex++;
      return this._mementos[this._currentIndex];
    }
    return null;
  }

  /**
   * Check if there is a previous memento available (for undo).
   * @returns {boolean} True if there is a previous memento, false otherwise.
   */
  canUndo() {
    return this._currentIndex > 0;
  }

  /**
   * Check if there is a next memento available (for redo).
   * @returns {boolean} True if there is a next memento, false otherwise.
   */
  canRedo() {
    return this._currentIndex < this._mementos.length - 1;
  }

  /**
   * Clear all saved mementos and reset the index.
   */
  clear() {
    this._mementos = [];
    this._currentIndex = -1;
  }
}

export default CartCareTaker;
