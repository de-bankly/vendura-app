/**
 * Service for managing product data
 */
class ProductService {
  /**
   * Get all products
   * @returns {Array} Array of product objects
   */
  getProducts() {
    // In a real app, this would fetch from an API
    return [
      { id: 1, name: 'Kaffee', price: 2.5, category: 'Getränke' },
      { id: 2, name: 'Espresso', price: 1.8, category: 'Getränke' },
      { id: 3, name: 'Cappuccino', price: 3.2, category: 'Getränke' },
      { id: 4, name: 'Latte Macchiato', price: 3.5, category: 'Getränke' },
      { id: 5, name: 'Tee', price: 2.0, category: 'Getränke' },
      { id: 6, name: 'Croissant', price: 1.5, category: 'Gebäck' },
      { id: 7, name: 'Muffin', price: 2.0, category: 'Gebäck' },
      { id: 8, name: 'Bagel', price: 2.5, category: 'Gebäck' },
      { id: 9, name: 'Sandwich', price: 4.0, category: 'Snacks' },
      { id: 10, name: 'Salat', price: 5.5, category: 'Snacks' },
      { id: 11, name: 'Suppe', price: 4.5, category: 'Snacks' },
      { id: 12, name: 'Wasser', price: 1.0, category: 'Getränke' },
    ];
  }

  /**
   * Group products by category
   * @param {Array} products Array of product objects
   * @returns {Object} Object with categories as keys and arrays of products as values
   */
  groupByCategory(products) {
    const grouped = {};
    products.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  }

  /**
   * Get products grouped by category
   * @returns {Object} Object with categories as keys and arrays of products as values
   */
  getProductsByCategory() {
    const products = this.getProducts();
    return this.groupByCategory(products);
  }
}

export default new ProductService();
