/**
 * @fileoverview Modelo de respuesta HTTP estandarizada
 * Proporciona una estructura consistente para todas las respuestas de la API
 */

/**
 * Clase para estandarizar respuestas HTTP
 * @class Response
 * @description Proporciona una estructura consistente para todas las respuestas de la API,
 * incluyendo status, mensaje y datos de respuesta
 */
class Response {
  /**
   * Constructor de la clase Response
   * @constructor
   * @param {number} status - Código de estado HTTP
   * @param {string|boolean} message - Mensaje de respuesta o indicador de éxito
   * @param {*} response - Datos de respuesta (opcional)
   * @description Crea una nueva instancia de respuesta con status, mensaje y datos
   */
  constructor(status, message, response) {
    this.status = status;
    this.message = message;
    this.response = response;
  }

  /**
   * Método estático para crear respuestas de forma flexible
   * @static
   * @method set
   * @param {...*} args - Argumentos variables para crear la respuesta
   * @returns {Response} Nueva instancia de Response
   * @description Crea respuestas basadas en el número de argumentos:
   * - 0 args: Error 404 por defecto
   * - 1 arg: Éxito 200 con datos
   * - 2 args: Status y mensaje personalizados
   * - 3 args: Status, mensaje y datos completos
   * @example
   * Response.set() // { status: 404, message: false, response: null }
   * Response.set(data) // { status: 200, message: true, response: data }
   * Response.set(400, 'Error') // { status: 400, message: 'Error', response: null }
   * Response.set(200, 'OK', data) // { status: 200, message: 'OK', response: data }
   */
  static set(...args) {
    if (args.length === 0) {
      return new Response(404, false, null);
    } else if (args.length === 1) {
      return new Response(200, true, args[0]);
    } else if (args.length === 2) {
      return new Response(args[0], args[1], null);
    } else if (args.length === 3) {
      return new Response(args[0], args[1], args[2]);
    }
  }
}

module.exports = Response;