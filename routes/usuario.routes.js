const express = require('express');
const UsuarioController = require('../controllers/usuario.controller');

const router = express.Router();

router.get('/', UsuarioController.listar);
router.get('/:id', UsuarioController.obtener);
router.post('/', UsuarioController.crear);
router.put('/:id', UsuarioController.actualizar);
router.delete('/:id', UsuarioController.eliminar);

module.exports = router;
