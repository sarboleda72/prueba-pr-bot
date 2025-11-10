// ⚠️ EJEMPLO MIXTO
// Archivo con PUNTO en nombre: order.controller.js ❌
// PERO con código mayormente correcto

const OrderService = require('../services/order-service'); // ✅ Import correcto

const MAX_ORDERS_PER_PAGE = 50; // ✅ Constante correcta
const DEFAULT_STATUS = 'pending'; // ✅ Constante correcta

/**
 * Controlador de órdenes
 */
class OrderController { // ✅ Clase correcta
  constructor() {
    this.orderService = new OrderService(); // ✅ Propiedad correcta
    this.maxOrders = MAX_ORDERS_PER_PAGE; // ✅ Propiedad correcta
  }

  /**
   * Lista todas las órdenes
   */
  async listOrders(req, res) { // ✅ Método correcto
    const pageNumber = req.query.page || 1; // ✅ Variable correcta
    const orders = await this.orderService.getOrders(pageNumber); // ✅ Variable correcta

    res.json({
      success: true,
      data: orders,
      page: pageNumber
    });
  }

  /**
   * Crea una nueva orden
   */
  async createOrder(req, res) { // ✅ Método correcto
    const orderData = req.body; // ✅ Variable correcta
    const newOrder = await this.orderService.create(orderData); // ✅ Variable correcta

    res.status(201).json({
      success: true,
      data: newOrder
    });
  }
}

module.exports = new OrderController();
