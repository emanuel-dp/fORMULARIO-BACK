// Conexión a SQL Server (el motor que se administra con SQL Server Management Studio)
const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'formulario_db',
  user: process.env.DB_USER || 'usuario_app',
 password: process.env.DB_PASSWORD || 'FormularioJU2026',
  options: {
    encrypt: false,               // conexión local
    trustServerCertificate: true
  }
};

// Si usas una instancia con nombre (ej: localhost\SQLEXPRESS), define DB_INSTANCE=SQLEXPRESS
if (process.env.DB_INSTANCE) {
  config.options.instanceName = process.env.DB_INSTANCE;
} else {
  config.port = parseInt(process.env.DB_PORT || '1433', 10);
}

let poolPromise = null;

function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config).connect().catch((error) => {
      poolPromise = null; // permite reintentar en la siguiente petición
      throw error;
    });
  }
  return poolPromise;
}

module.exports = { sql, getPool };
