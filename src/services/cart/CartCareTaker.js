/**
 * CartCareTaker class
 * Responsible for managing cart mementos (saving and restoring cart states)
 */
class CartCareTaker {
  constructor() {
    this._mementos = [];
    this._currentIndex = -1; // -1 means no memento is selected
    this._maxMementos = 10; // Maximum number of mementos to store
  }

  /**
   * Save a new cart state
   * @param {CartMemento} memento - The memento to save
   */
  addMemento(memento) {
    // If we're not at the end of the history, remove any future mementos
    if (this._currentIndex < this._mementos.length - 1) {
      this._mementos = this._mementos.slice(0, this._currentIndex + 1);
    }

    // Add the new memento
    this._mementos.push(memento);

    // Enforce the maximum number of mementos
    if (this._mementos.length > this._maxMementos) {
      this._mementos.shift(); // Remove the oldest memento
    }

    // Update the current index to point to the newest memento
    this._currentIndex = this._mementos.length - 1;
  }

  /**
   * Get the memento at the specified index
   * @param {number} index - The index of the memento to get
   * @returns {CartMemento|null} The memento at the specified index, or null if index is invalid
   */
  getMemento(index) {
    if (index >= 0 && index < this._mementos.length) {
      return this._mementos[index];
    }
    return null;
  }

  /**
   * Get all saved mementos
   * @returns {Array} All saved mementos
   */
  getAllMementos() {
    return [...this._mementos];
  }

  /**
   * Get the total number of saved mementos
   * @returns {number} The number of saved mementos
   */
  getMementoCount() {
    return this._mementos.length;
  }

  /**
   * Get the previous memento (for undo functionality)
   * @returns {CartMemento|null} The previous memento, or null if there is no previous memento
   */
  getPreviousMemento() {
    if (this._currentIndex > 0) {
      return this._mementos[--this._currentIndex];
    }
    return null;
  }

  /**
   * Get the next memento (for redo functionality)
   * @returns {CartMemento|null} The next memento, or null if there is no next memento
   */
  getNextMemento() {
    if (this._currentIndex < this._mementos.length - 1) {
      return this._mementos[++this._currentIndex];
    }
    return null;
  }

  /**
   * Check if there is a previous memento available (for undo)
   * @returns {boolean} True if there is a previous memento, false otherwise
   */
  canUndo() {
    return this._currentIndex > 0;
  }

  /**
   * Check if there is a next memento available (for redo)
   * @returns {boolean} True if there is a next memento, false otherwise
   */
  canRedo() {
    return this._currentIndex < this._mementos.length - 1;
  }

  /**
   * Clear all saved mementos
   */
  clear() {
    this._mementos = [];
    this._currentIndex = -1;
  }
}

export default CartCareTaker;
