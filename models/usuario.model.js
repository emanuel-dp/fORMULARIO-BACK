// Capa de acceso a datos: aquí viven las consultas SQL (T-SQL)
const { sql, getPool } = require('../config/db');

// Alias para devolver los nombres en camelCase, como espera el frontend
const COLUMNAS = `
  id,
  tipo_documento   AS tipoDocumento,
  numero_documento AS numeroDocumento,
  nombres,
  apellidos,
  direccion,
  ciudad,
  CONVERT(VARCHAR(10), fecha_nacimiento, 23) AS fechaNacimiento,
  correo,
  celular
`;

// Convierte el id de la URL a entero; devuelve null si no es válido
function aEntero(id) {
  const n = Number(id);
  return Number.isInteger(n) ? n : null;
}

const UsuarioModel = {
  async obtenerTodos() {
    const pool = await getPool();
    const r = await pool.request().query(`SELECT ${COLUMNAS} FROM usuarios ORDER BY id`);
    return r.recordset;
  },

  async obtenerPorId(id) {
    const idNum = aEntero(id);
    if (idNum === null) return null;
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, idNum)
      .query(`SELECT ${COLUMNAS} FROM usuarios WHERE id = @id`);
    return r.recordset[0] || null;
  },

  async obtenerPorDocumento(tipoDocumento, numeroDocumento) {
    const pool = await getPool();
    const r = await pool.request()
      .input('tipo', sql.VarChar(2), tipoDocumento)
      .input('numero', sql.VarChar(20), numeroDocumento)
      .query('SELECT id FROM usuarios WHERE tipo_documento = @tipo AND numero_documento = @numero');
    return r.recordset[0] || null;
  },

  async crear(u) {
    const pool = await getPool();
    const r = await pool.request()
      .input('tipo', sql.VarChar(2), u.tipoDocumento)
      .input('numero', sql.VarChar(20), u.numeroDocumento)
      .input('nombres', sql.VarChar(100), u.nombres)
      .input('apellidos', sql.VarChar(100), u.apellidos || null)
      .input('direccion', sql.VarChar(150), u.direccion || null)
      .input('ciudad', sql.VarChar(50), u.ciudad || null)
      .input('fecha', sql.VarChar(10), u.fechaNacimiento || null)
      .input('correo', sql.VarChar(120), u.correo)
      .input('celular', sql.VarChar(15), u.celular)
      .query(`INSERT INTO usuarios
              (tipo_documento, numero_documento, nombres, apellidos, direccion, ciudad, fecha_nacimiento, correo, celular)
              OUTPUT INSERTED.id
              VALUES (@tipo, @numero, @nombres, @apellidos, @direccion, @ciudad, CONVERT(DATE, @fecha, 23), @correo, @celular)`);
    return r.recordset[0].id;
  },

  async actualizar(id, u) {
    const idNum = aEntero(id);
    if (idNum === null) return 0;
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, idNum)
      .input('nombres', sql.VarChar(100), u.nombres)
      .input('apellidos', sql.VarChar(100), u.apellidos || null)
      .input('direccion', sql.VarChar(150), u.direccion || null)
      .input('ciudad', sql.VarChar(50), u.ciudad || null)
      .input('fecha', sql.VarChar(10), u.fechaNacimiento || null)
      .input('correo', sql.VarChar(120), u.correo)
      .input('celular', sql.VarChar(15), u.celular)
      .query(`UPDATE usuarios SET
                nombres = @nombres, apellidos = @apellidos, direccion = @direccion, ciudad = @ciudad,
                fecha_nacimiento = CONVERT(DATE, @fecha, 23), correo = @correo, celular = @celular
              WHERE id = @id`);
    return r.rowsAffected[0];
  },

  async eliminar(id) {
    const idNum = aEntero(id);
    if (idNum === null) return 0;
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, idNum)
      .query('DELETE FROM usuarios WHERE id = @id');
    return r.rowsAffected[0];
  }
};

module.exports = UsuarioModel;
