const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        // Borrar la imágen anterior
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo) => {

    let pathViejo = '';
    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log('No existe un médico con ese id');
                return false;
            }
            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();
            return true;
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('No existe un hospital con ese id');
                return false;
            }
            pathViejo = `./uploads/medicos/${hospital.img}`;
            borrarImagen(pathViejo);
            
            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('No existe un usuario con ese id');
                return false;
            }
            pathViejo = `./uploads/medicos/${usuario.img}`;
            borrarImagen(pathViejo);
            
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
    }

}

module.exports = { actualizarImagen };