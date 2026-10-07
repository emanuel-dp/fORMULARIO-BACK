// Controlador: recibe la petición HTTP, llama al servicio y arma la respuesta
const UsuarioService = require('../services/usuario.service');

function manejarError(res, error) {
  if (error.estado) {
    return res.status(error.estado).json({ mensaje: error.message });
  }
  console.error(error);
  res.status(500).json({ mensaje: 'Error interno del servidor.' });
}

const UsuarioController = {
  async listar(req, res) {
    try {
      res.json(await UsuarioService.listar());
    } catch (error) { manejarError(res, error); }
  },

  async obtener(req, res) {
    try {
      res.json(await UsuarioService.obtener(req.params.id));
    } catch (error) { manejarError(res, error); }
  },

  async crear(req, res) {
    try {
      const usuario = await UsuarioService.crear(req.body);
      res.status(201).json(usuario);
    } catch (error) { manejarError(res, error); }
  },

  async actualizar(req, res) {
    try {
      res.json(await UsuarioService.actualizar(req.params.id, req.body));
    } catch (error) { manejarError(res, error); }
  },

  async eliminar(req, res) {
    try {
      await UsuarioService.eliminar(req.params.id);
      res.json({ mensaje: 'Usuario eliminado correctamente.' });
    } catch (error) { manejarError(res, error); }
  }
};

module.exports = UsuarioController;
