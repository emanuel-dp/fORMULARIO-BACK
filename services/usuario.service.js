// Lógica de negocio: validaciones y reglas antes de tocar la base de datos
const UsuarioModel = require('../models/usuario.model');

const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexSoloNumeros = /^[0-9]+$/;
const TIPOS_DOCUMENTO = ['CC', 'TI', 'CE', 'PA'];

// Error con código HTTP para que el controlador sepa qué responder
class ErrorServicio extends Error {
  constructor(mensaje, estado) {
    super(mensaje);
    this.estado = estado;
  }
}

function validar(u, esCreacion) {
  if (esCreacion) {
    if (!TIPOS_DOCUMENTO.includes(u.tipoDocumento)) {
      throw new ErrorServicio('El tipo de documento es obligatorio y debe ser válido.', 400);
    }
    if (!u.numeroDocumento || !regexSoloNumeros.test(String(u.numeroDocumento).trim())) {
      throw new ErrorServicio('El número de documento es obligatorio y debe ser numérico.', 400);
    }
  }
  if (!u.nombres || u.nombres.trim() === '') {
    throw new ErrorServicio('El nombre es obligatorio.', 400);
  }
  if (!u.correo || !regexCorreo.test(u.correo.trim())) {
    throw new ErrorServicio('El correo es obligatorio y debe tener un formato válido.', 400);
  }
  if (!u.celular || !regexSoloNumeros.test(String(u.celular).trim())) {
    throw new ErrorServicio('El celular es obligatorio y debe ser numérico.', 400);
  }
}

const UsuarioService = {
  listar() {
    return UsuarioModel.obtenerTodos();
  },

  async obtener(id) {
    const usuario = await UsuarioModel.obtenerPorId(id);
    if (!usuario) throw new ErrorServicio('Usuario no encontrado.', 404);
    return usuario;
  },

  async crear(datos) {
    validar(datos, true);

    const documento = String(datos.numeroDocumento).trim();
    const existente = await UsuarioModel.obtenerPorDocumento(datos.tipoDocumento, documento);
    if (existente) {
      throw new ErrorServicio('Ya existe un usuario con ese documento.', 409);
    }

    const id = await UsuarioModel.crear({
      ...datos,
      numeroDocumento: documento,
      nombres: datos.nombres.trim(),
      correo: datos.correo.trim(),
      celular: String(datos.celular).trim()
    });
    return UsuarioModel.obtenerPorId(id);
  },

  async actualizar(id, datos) {
    validar(datos, false);

    const filas = await UsuarioModel.actualizar(id, {
      ...datos,
      nombres: datos.nombres.trim(),
      correo: datos.correo.trim(),
      celular: String(datos.celular).trim()
    });
    if (filas === 0) throw new ErrorServicio('Usuario no encontrado.', 404);
    return UsuarioModel.obtenerPorId(id);
  },

  async eliminar(id) {
    const filas = await UsuarioModel.eliminar(id);
    if (filas === 0) throw new ErrorServicio('Usuario no encontrado.', 404);
  }
};

module.exports = UsuarioService;
