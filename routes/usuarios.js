/*
 Ruta: /api/usuarios 
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios);

router.post('/',
    [
        check('nombre', 'El campo nombre es obligatorio').not().isEmpty(),
        check('password', 'El campo password es obligatorio').not().isEmpty(),
        check('email', 'El campo email obligatorio').isEmail(),
        validarCampos
    ], crearUsuario);

router.put('/:id', 
    [
        validarJWT,
        check('nombre', 'El campo nombre es obligatorio').not().isEmpty(),
        check('email', 'El campo email obligatorio').isEmail(),
        check('role', 'El campo role nombre es obligatorio').not().isEmpty(),
        validarCampos,
    ], actualizarUsuario);

router.delete('/:id', validarJWT, borrarUsuario);

module.exports = router;