/**
 * @fileoverview Utilidades para parámetros de conexión por oficina
 * Centraliza la configuración de oficinas y empresas del sistema Gomedisys
 */

/**
 * Mapeo de nombres de IPS a parámetros de conexión
 * @function getConnectionParamsByIpsName
 * @param {string} ipsName - Nombre completo de la IPS
 * @returns {Object} Objeto con officeId y companyId
 * @description Mapea nombres completos de IPS a sus respectivos parámetros de conexión
 */
const getConnectionParamsByIpsName = (ipsName) => {
  const ipsMapping = {
    "Clínica Avidanti Santa Marta": { "officeId": "17", "companyId": "1" },
    "Clínica Avidanti Manizales": { "officeId": "8", "companyId": "1" },
    "Clínica Avidanti Ciudad Verde": { "officeId": "24", "companyId": "709862" },
    "Clínica Avidanti Ibagué": { "officeId": "3", "companyId": "1" },
    "Angiografía Villavicencio": { "officeId": "9", "companyId": "329436" },
    "Clinica Chia": { "officeId": "25", "companyId": "784046" },
    "Sogamoso": { "officeId": "26", "companyId": "784046" },
    "Clinica Avidanti Armenia": { "officeId": "45", "companyId": "740006" }
  };

  const params = ipsMapping[ipsName] || {
    "officeId": "8",
    "companyId": "1"
  };

  console.log(`Parámetros para ${ipsName}:`, params);
  return params;
};

module.exports = { getConnectionParamsByIpsName };
