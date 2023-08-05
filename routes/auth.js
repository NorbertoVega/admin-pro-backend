/*
 Ruta: /api/login
*/
const { Router } = require('express');
const { login } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', 
    [
        check('email', 'El campo email obligatorio').isEmail(),
        check('password', 'El campo password es obligatorio').not().isEmpty(),
        validarCampos
    ], login);

module.exports = router;