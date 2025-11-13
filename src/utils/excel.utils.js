const xlsx = require('xlsx');

const create = async (data) => {
	try {
	  // Crear una hoja de trabajo (worksheet) a partir del JSON
	  const worksheet = xlsx.utils.json_to_sheet(data);
  
	  // Crear un libro de trabajo (workbook) y agregar la hoja
	  const workbook = xlsx.utils.book_new();
	  xlsx.utils.book_append_sheet(workbook, worksheet, 'Reporte');
  
	  // Escribir el archivo Excel en un buffer
	  const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  
	  // Convertir el buffer a Base64
	  const excelBase64 = excelBuffer.toString('base64');
  
	  return excelBase64; // Retornar el archivo Excel en formato Base64
	} catch (error) {
	  console.error('Error al crear el archivo Excel:', error);
	  throw new Error('No se pudo generar el archivo Excel.');
	}
  };

const readExcelFromBase64 = async (base64Data) => {
  try {
    // Convertir base64 a buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Leer el archivo Excel desde el buffer
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    
    // Obtener la primera hoja
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir la hoja a JSON con punto y coma como separador (CSV)
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { 
      header: 1, // Para obtener arrays en lugar de objetos
      defval: '' // Valor por defecto para celdas vacías
    });
    
    return jsonData;
  } catch (error) {
    console.error('Error al leer el archivo Excel:', error);
    throw new Error('No se pudo leer el archivo Excel.');
  }
};

const readExcelFromBuffer = async (buffer) => {
  try {
    // Leer el archivo Excel directamente desde el buffer
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    
    // Obtener la primera hoja
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir la hoja a JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { 
      header: 1, // Para obtener arrays en lugar de objetos
      defval: '' // Valor por defecto para celdas vacías
    });
    
    return jsonData;
  } catch (error) {
    console.error('Error al leer el archivo Excel:', error);
    throw new Error('No se pudo leer el archivo Excel.');
  }
};

const parseReportData = (jsonData, batch, clientName, clientDocument) => {
  try {
    // Buscar la fila de encabezados (que contiene "Tipo de documento")
    let headerRowIndex = -1;
    for (let i = 0; i < jsonData.length; i++) {
      if (jsonData[i].some(cell => cell && cell.includes && cell.includes('Tipo de documento'))) {
        headerRowIndex = i;
        break;
      }
    }
    
    if (headerRowIndex === -1) {
      throw new Error('No se encontraron encabezados válidos en el archivo Excel');
    }
    
    // Obtener encabezados y datos
    const headers = jsonData[headerRowIndex];
    const dataRows = jsonData.slice(headerRowIndex + 1);
    
    // Mapear datos a formato esperado
    const parsedData = dataRows
      .filter(row => row.length > 0 && row.some(cell => cell !== '')) // Filtrar filas vacías
      .map(row => {
        const rowData = {};
        
        headers.forEach((header, index) => {
          const value = row[index] || '';
          
          // Convertir a string si no lo es ya
          const stringValue = value !== null && value !== undefined ? value.toString() : '';
          
          // Debug de valores importantes
          if (['Fecha Emisión', 'Fecha Recepción', 'IC', 'IVA'].includes(header)) {
            const parsedValue = header === 'Fecha Emisión' ? parseDate(stringValue) :
                               header === 'Fecha Recepción' ? parseDateTime(stringValue) :
                               parseDecimal(stringValue);
            console.log(`${header}: "${stringValue}" -> ${parsedValue}`);
          }
          
          switch (header) {
            case 'Tipo de documento':
              rowData.documentType = stringValue;
              break;
            case 'CUFE/CUDE':
              rowData.cufeCude = stringValue;
              break;
            case 'Folio':
              rowData.folio = stringValue;
              break;
            case 'Prefijo':
              rowData.prefix = stringValue;
              break;
            case 'Fecha Emisión':
              rowData.issueDate = parseDate(stringValue);
              break;
            case 'Fecha Recepción':
              rowData.receptionDate = parseDateTime(stringValue);
              break;
            case 'NIT Emisor':
              rowData.issuerNit = stringValue;
              break;
            case 'Nombre Emisor':
              rowData.issuerName = stringValue;
              break;
            case 'NIT Receptor':
              rowData.receiverNit = stringValue;
              break;
            case 'Nombre Receptor':
              rowData.receiverName = stringValue;
              break;
            case 'IVA':
              rowData.vat = parseDecimal(stringValue);
              break;
            case 'ICA':
              rowData.ica = parseDecimal(stringValue);
              break;
            case 'IPC':
              rowData.ipc = parseDecimal(stringValue);
              break;
            case 'IC': // El nuevo archivo usa "IC" en lugar de "IPC"
              rowData.ipc = parseDecimal(stringValue);
              break;
            case 'Total':
              rowData.total = parseDecimal(stringValue);
              break;
            case 'Estado':
              rowData.status = stringValue;
              break;
            case 'Grupo':
              rowData.group = stringValue;
              break;
          }
        });
        
        // Agregar campos adicionales
        rowData.batch = batch;
        rowData.clientName = clientName;
        rowData.clientDocument = clientDocument;
        
        return rowData;
      });
    
    return parsedData;
  } catch (error) {
    console.error('Error al parsear los datos:', error);
    throw new Error('Error al procesar los datos del archivo Excel');
  }
};

// Función para convertir número serial de Excel a fecha
const excelSerialToDate = (serial) => {
  // Excel cuenta días desde el 1 de enero de 1900 (con un bug que cuenta 1900 como año bisiesto)
  const excelEpoch = new Date(1899, 11, 30); // 30 de diciembre de 1899
  const days = Math.floor(serial);
  const milliseconds = (serial - days) * 24 * 60 * 60 * 1000;
  
  const date = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000 + milliseconds);
  return date;
};

// Funciones auxiliares para parseo de datos
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  
  try {
    const cleanStr = dateStr.toString().trim();
    
    // Si es un número (serial de Excel)
    if (!isNaN(cleanStr) && cleanStr !== '') {
      const serial = parseFloat(cleanStr);
      if (serial > 0 && serial < 100000) { // Rango válido para fechas Excel
        return excelSerialToDate(serial);
      }
    }
    
    // Formato nuevo: "3/07/2025" (d/mm/yyyy o dd/mm/yyyy)
    if (cleanStr.includes('/')) {
      const parts = cleanStr.split('/');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return new Date(`${year}-${month}-${day}`);
      }
    }
    
    // Formato anterior: "19-12-2024" (dd-mm-yyyy)
    if (cleanStr.includes('-')) {
      const parts = cleanStr.split('-');
      if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return null;
  }
};

const parseDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return null;
  
  try {
    const cleanStr = dateTimeStr.toString().trim();
    
    // Si es un número (serial de Excel con decimales para la hora)
    if (!isNaN(cleanStr) && cleanStr !== '') {
      const serial = parseFloat(cleanStr);
      if (serial > 0 && serial < 100000) { // Rango válido para fechas Excel
        return excelSerialToDate(serial);
      }
    }
    
    // Formato nuevo: "3/07/2025 15:41" o "5/07/2025 20:11"
    if (cleanStr.includes('/')) {
      const [datePart, timePart] = cleanStr.split(' ');
      if (datePart && timePart) {
        const dateParts = datePart.split('/');
        if (dateParts.length === 3) {
          const day = dateParts[0].padStart(2, '0');
          const month = dateParts[1].padStart(2, '0');
          const year = dateParts[2];
          return new Date(`${year}-${month}-${day} ${timePart}:00`);
        }
      }
    }
    
    // Formato anterior: "19-12-2024 18:05:15"
    if (cleanStr.includes('-')) {
      const [datePart, timePart] = cleanStr.split(' ');
      if (datePart && timePart) {
        const dateParts = datePart.split('-');
        if (dateParts.length === 3) {
          return new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${timePart}`);
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing datetime:', dateTimeStr, error);
    return null;
  }
};

const parseDecimal = (value) => {
  if (!value || value === '' || value === null || value === undefined) return 0;
  
  try {
    let cleanValue = value.toString().trim();
    
    // Si está vacío después de trim
    if (cleanValue === '') return 0;
    
    // Si el valor contiene tanto puntos como comas, asumimos que el punto es separador de miles y la coma es decimal
    // Ejemplo: "1.234,56" -> "1234.56"
    if (cleanValue.includes('.') && cleanValue.includes(',')) {
      cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
    }
    // Si solo tiene coma, la reemplazamos por punto (formato europeo)
    else if (cleanValue.includes(',') && !cleanValue.includes('.')) {
      cleanValue = cleanValue.replace(',', '.');
    }
    
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
  } catch (error) {
    console.error('Error parsing decimal:', value, error);
    return 0;
  }
};

module.exports = { create, readExcelFromBase64, readExcelFromBuffer, parseReportData };