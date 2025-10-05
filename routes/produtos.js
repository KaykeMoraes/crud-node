const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.post('/', produtoController.cadastrar);
router.get('/:userId', produtoController.listarPorUsuario);
router.put('/', produtoController.atualizar);
router.delete('/:id', produtoController.deletar);

module.exports = router;
