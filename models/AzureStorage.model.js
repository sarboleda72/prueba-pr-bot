/**
 * @fileoverview Modelo para interactuar con Azure File Share
 * Proporciona métodos para subir, descargar y gestionar archivos en Azure Storage
 */

require('dotenv').config();
const { ShareServiceClient, StorageSharedKeyCredential } = require('@azure/storage-file-share');
const fs = require('fs');
const path = require('path');

/**
 * Clase para manejar operaciones con Azure File Share
 * @class AzureFileShare
 * @description Proporciona métodos para interactuar con Azure File Share,
 * incluyendo subida de archivos, descarga y gestión de directorios
 */
class AzureFileShare {
  /**
   * Constructor de la clase AzureFileShare
   * @constructor
   * @description Inicializa la conexión con Azure File Share usando credenciales del entorno
   */
  constructor() {
    this.account = process.env.ACCOUNT;
    this.accountKey = process.env.ACCOUNT_KEY;
    this.shareName = process.env.SHARE_NAME;
    this.directoryName = process.env.DIRECTORY_NAME || ''; // Directorio raíz por defecto

    const credential = new StorageSharedKeyCredential(this.account, this.accountKey);
    const serviceClient = new ShareServiceClient(
      `https://${this.account}.file.core.windows.net`,
      credential
    );

    this.shareClient = serviceClient.getShareClient(this.shareName); // Obtener el cliente del recurso compartido
  }

  /**
   * Busca archivos y carpetas en un directorio de Azure File Share
   * @async
   * @method searchFilesAndDirectories
   * @param {string} [directoryPath=this.directoryName] - Ruta del directorio a buscar
   * @returns {Promise<Array>} Lista de archivos y carpetas encontrados
   * @throws {Error} Si ocurre un error durante la búsqueda
   * @description Lista todos los archivos y carpetas en el directorio especificado
   */
  async searchFilesAndDirectories(directoryPath = this.directoryName) {
    try {
      const directoryClient = this.shareClient.getDirectoryClient(directoryPath);
      const items = [];

      for await (const item of directoryClient.listFilesAndDirectories()) {
        items.push(item);
      }

      return items;
    } catch (error) {
      console.error('Error al buscar archivos y carpetas:', error.message);
      throw error;
    }
  }

  /**
   * Descarga un archivo desde Azure File Share
   * @async
   * @method downloadFile
   * @param {string} filePath - Ruta del archivo en Azure File Share
   * @param {string} [downloadFolder='./temp'] - Carpeta local donde descargar
   * @returns {Promise<string>} Ruta completa del archivo descargado
   * @throws {Error} Si ocurre un error durante la descarga
   * @description Descarga un archivo específico desde Azure File Share al sistema local
   */
  async downloadFile(filePath, downloadFolder = './temp') {
    try {
      // Obtener el cliente del directorio y luego el cliente del archivo
      const directoryPath = path.dirname(filePath); // Ruta del directorio
      const fileName = path.basename(filePath); // Nombre del archivo
      const directoryClient = this.shareClient.getDirectoryClient(directoryPath);
      const fileClient = directoryClient.getFileClient(fileName);

      // Crear la carpeta de destino si no existe
      if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder, { recursive: true });
      }

      const downloadFilePath = path.join(downloadFolder, fileName);
      await fileClient.downloadToFile(downloadFilePath);

      return downloadFilePath;
    } catch (error) {
      console.error('Error al descargar el archivo:', error.message);
      throw error;
    }
  }

  // Descargar un directorio completo (incluyendo subcarpetas y archivos)
  async downloadDirectory(directoryPath, downloadFolder = './temp') {
    try {
      const directoryClient = this.shareClient.getDirectoryClient(directoryPath);
      const items = await this.searchFilesAndDirectories(directoryPath);

      for (const item of items) {
        const itemPath = path.join(directoryPath, item.name);
        const localPath = path.join(downloadFolder, item.name);

        if (item.kind === 'file') {
          // Descargar archivo
          await this.downloadFile(itemPath, downloadFolder);
        } else if (item.kind === 'directory') {
          // Crear carpeta localmente
          if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath, { recursive: true });
          }
          // Descargar contenido de la subcarpeta
          await this.downloadDirectory(itemPath, localPath);
        }
      }

    } catch (error) {
      console.error('Error al descargar el directorio:', error.message);
      throw error;
    }
  }

  /**
   * Sube un archivo a Azure File Share
   * @async
   * @method upload
   * @param {string} directoryName - Nombre del directorio en Azure donde subir
   * @param {string} filePath - Ruta local del archivo a subir
   * @returns {Promise<void>}
   * @throws {Error} Si el archivo no existe o falla la subida
   * @description Sube un archivo a Azure File Share. Si el archivo es mayor a 4MB,
   * lo fragmenta y sube por chunks. Crea el directorio si no existe.
   * @example
   * await azureStorage.upload('ACM-1426249', './temp/factura.pdf');
   */
  async upload(directoryName, filePath) {
    try {
      // Validar que el archivo exista
      if (!fs.existsSync(filePath)) {
        throw new Error(`El archivo ${filePath} no existe.`);
      }

      // Validar el tamaño del archivo
      const stats = fs.statSync(filePath);
      const fileSizeInBytes = stats.size;
      const maxChunkSize = 4 * 1024 * 1024; // 4 MB en bytes

      // Obtener el cliente del directorio
      const directoryClient = this.shareClient.getDirectoryClient(directoryName);

      // Crear el directorio si no existe
      const exists = await directoryClient.exists();
      if (!exists) {
        await directoryClient.create();
      }

      // Obtener el nombre del archivo
      const fileName = path.basename(filePath);

      if (fileSizeInBytes <= maxChunkSize) {
        // Subir el archivo completo si es menor o igual a 4 MB
        const fileClient = directoryClient.getFileClient(fileName);
        await fileClient.create(fileSizeInBytes);
        const fileContent = fs.readFileSync(filePath);
        await fileClient.uploadRange(fileContent, 0, fileSizeInBytes);
      } else {
        // Fragmentar el archivo y subirlo por partes
        const fileClient = directoryClient.getFileClient(fileName);
        await fileClient.create(fileSizeInBytes);

        const fileStream = fs.createReadStream(filePath, { highWaterMark: maxChunkSize });
        let offset = 0;

        for await (const chunk of fileStream) {
          const chunkSize = chunk.length;
          await fileClient.uploadRange(chunk, offset, chunkSize);
          offset += chunkSize;
        }
      }

      console.log(`Archivo ${fileName} subido exitosamente al directorio ${directoryName}.`);
    } catch (error) {
      console.error('Error al subir el archivo:', error.message);
      throw error;
    }
  }
}

module.exports = AzureFileShare;