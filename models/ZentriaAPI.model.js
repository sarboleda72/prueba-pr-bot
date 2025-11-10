/**
 * @fileoverview Modelo para interactuar con la API de Zentria
 * Proporciona métodos para consultar facturas y subir PDFs al sistema ETL
 */

require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

/**
 * Clase para manejar operaciones con la API de Zentria
 * @class ZentriaAPI
 * @description Proporciona métodos para interactuar con el sistema Zentria,
 * incluyendo consulta de facturas pendientes y subida de PDFs procesados
 */
class ZentriaAPI {
  /**
   * Constructor de la clase ZentriaAPI
   * @constructor
   * @description Inicializa las URLs y claves API desde variables de entorno
   */
  constructor() {
    this.etlUrl = process.env.ZENTRIA_API_URL_ETL;
    this.apiUrl = process.env.ZENTRIA_API_URL_API;
    this.apiKey = process.env.ZENTRIA_API_KEY;
  }

  /**
   * Obtiene las cuentas disponibles para procesar
   * @async
   * @method getAccounts
   * @returns {Promise<Array>} Lista de cuentas con actividades y deportes
   * @throws {Error} Si la consulta falla
   * @description Consulta las cuentas disponibles en el sistema Zentria
   * @deprecated Este método no se usa actualmente en el flujo principal
   */
  async getAccounts() {
    try {
      const headers = {
        'X-API-Key': this.apiKey
      }

      const response = await axios.get(`${this.apiUrl}/facturas/itemsActividadesConSportes`, {
        headers,
      });

      return response.data;

    } catch (error) {
      console.error('Error al consultar las cuentas para armar:', error.message);
      //throw error;
    }
  }

  /**
   * Obtiene la lista de facturas pendientes de procesamiento
   * @async
   * @method getInvoice
   * @returns {Promise<string[]>} Array de números de factura sin PDF ni JSON CUV
   * @throws {Error} Si la consulta falla
   * @description Consulta las facturas que están pendientes de descarga de PDF y generación de JSON CUV.
   * Utilizado por el bucle automático de procesamiento.
   * @example
   * const invoices = await zentriaAPI.getInvoice();
   * // returns ['ACM-1426249', 'DIAC-123456', ...]
   */
  async getInvoice() {
    try {
      const headers = {
        'X-API-Key': this.apiKey
      }

      const response = await axios.get(`${this.apiUrl}/facturas/estado-facturas-reporte/sin_pdf_sin_json_cuv`, {
        headers,
      });

      return response.data.list_invoices;

    } catch (error) {
      console.error('Error al consultar facturas para descargar:', error.message);
    }
  }

  /**
   * Sube un PDF a la ETL usando codificación Base64
   * @async
   * @method uploadPdfEtl
   * @param {string} pdfPath - Ruta local del archivo PDF a subir
   * @returns {Promise<Object>} Respuesta de la API
   * @throws {Error} Si la subida falla
   * @description Convierte el PDF a Base64 y lo envía a la ETL de Zentria
   * @deprecated Usar uploadPdfEtlV3 en su lugar (método más eficiente)
   */
  async uploadPdfEtl(pdfPath) {
    try {
      // Leer el archivo PDF y convertirlo a Base64
      const pdfBuffer = fs.readFileSync(pdfPath);
      const pdfBase64 = pdfBuffer.toString('base64');

      const headers = {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      };

      const body = {
        bpdf_factura: pdfBase64
      };

      const response = await axios.post(`${this.apiUrl}/facturas/itemsFacturas`, body, {
        headers,
      });

      return response.data;

    } catch (error) {
      console.error('Error al subir el PDF a la ETL:', error.message);
      //throw error;
    }
  }

  /**
   * Sube un PDF a la ETL usando FormData (método recomendado)
   * @async
   * @method uploadPdfEtlV3
   * @param {string} pdfPath - Ruta local del archivo PDF a subir
   * @returns {Promise<Object>} Respuesta de la API
   * @throws {Error} Si la subida falla
   * @description Sube el PDF usando FormData multipart, método más eficiente que Base64.
   * Usado en el flujo principal de procesamiento de facturas.
   * @example
   * await zentriaAPI.uploadPdfEtlV3('./temp/ACM-1426249/ACM-1426249.pdf');
   */
  async uploadPdfEtlV3(pdfPath) {
    const form = new FormData();

    try {
      // Agregar el archivo PDF al formulario
      form.append('factura_pdf', fs.createReadStream(pdfPath));

      // Configurar los encabezados, incluyendo los generados automáticamente por FormData
      const headers = {
        'X-API-Key': this.apiKey,
        ...form.getHeaders(),
      };

      // Realizar la solicitud POST con axios
      const response = await axios.post(`${this.etlUrl}/facturas/items-facturas`, form, {
        headers,
      });

      return response.data;

    } catch (error) {
      console.error('Error al subir el PDF a la ETL:', error.message);
    }
  }
}

module.exports = ZentriaAPI;