const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {

    // Leer el token
    const token = req.header('x-token');
    
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en el request'
        });
    }

    // Verificar el token
    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next();
    }
    catch(error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
};

module.exports = { validarJWT }