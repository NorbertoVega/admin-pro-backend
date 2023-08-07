const path = require('path');
const fs = require('fs');

const { response, request } = require('express');
const { v4: uuidv4 } = require('uuid');

const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = (req = request, res = response) => {

    try {
        const { tipo, id } = req.params;

        const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({
                ok: false,
                msg: 'El tipo no es un médico, usuario u hospital'
            });
        }

        // Validar que exista un archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No hay ningún archivo'
            });
        }

        // Procesar la imagen
        const file = req.files.imagen;
        const nombreCortado = file.name.split('.'); // ejemplo.1.1.3.jpg
        const extensionArchivo = nombreCortado[nombreCortado.length - 1];

        // Validar extensión
        const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
        if (!extensionesValidas.includes(extensionArchivo)) {
            return res.status(400).json({
                ok: false,
                msg: 'El archivo no tiene una extensión permitida'
            });
        }

        // Generar el nombre del archivo
        const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

        // Path para guardar la imágen
        const path = `./uploads/${tipo}/${nombreArchivo}`;

        //Mover la imágen
        file.mv(path, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al mover la imágen'
                });
            }

            // Actualizar base de datos
            actualizarImagen(tipo, id, nombreArchivo);

            res.json({
                ok: true,
                msg: 'Archivo subido',
                nombreArchivo
            });
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

const retornaImagen = (req = request, res = response) => {

    try {
        const { tipo, foto } = req.params;

        const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);
        
        // Imágen por defecto
        if (fs.existsSync(pathImg)) {
            res.sendFile(pathImg);
        }
        else {
            const pathImg = path.join(__dirname, `../uploads/no-img.png`);
            res.sendFile(pathImg);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

module.exports = { 
    fileUpload,
    retornaImagen 
}