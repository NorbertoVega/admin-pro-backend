const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Email no valido'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password no valido'
            });
        }

        // Genear token
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const googleSignIn = async (req, res = response) => {

    try {
        const { token } = req.body;
        const { email, name, picture } = await googleVerify(token);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            usuario = new Usuario({ 
                nombre: name,
                email: email,
                password: '@@@',
                img: picture,
                google: true
             });
        }
        else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();

        // Genear token
        const jwt = await generarJWT(usuario.id);

        res.json({
            ok: true,
            email, name, picture,
            jwt
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    // Genear token
    const jwt = await generarJWT(uid);

    res.json({
        ok: true,
        jwt
    });
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}