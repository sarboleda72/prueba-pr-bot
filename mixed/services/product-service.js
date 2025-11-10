// ⚠️ EJEMPLO MIXTO
// Archivo con nombre correcto: product-service.js ✅
// PERO contiene errores de código

const API_ENDPOINT = 'https://api.products.com'; // ✅ Constante correcta
const timeout = 3000; // ❌ Constante sin UPPER_SNAKE_CASE

/**
 * Servicio de productos con errores mixtos
 */
class ProductService { // ✅ Clase correcta
  constructor() {
    this.apiEndpoint = API_ENDPOINT; // ✅ Variable correcta
    this.request_timeout = timeout; // ❌ Propiedad en snake_case
  }

  /**
   * Obtiene productos activos
   */
  async getActiveProducts() { // ✅ Método correcto
    const product_list = await this.fetchProducts(); // ❌ Variable en snake_case
    const active_products = product_list.filter(p => p.isActive); // ❌ Variable en snake_case
    
    return active_products;
  }

  /**
   * Busca producto por ID
   */
  async findProductById(productId) { // ✅ Método y parámetro correctos
    const found_product = await this.getProductFromDB(productId); // ❌ Variable en snake_case
    return found_product;
  }

  async fetchProducts() { // ✅ Método correcto
    return [];
  }

  async getProductFromDB(id) { // ✅ Método correcto
    return null;
  }
}

module.exports = ProductService;
