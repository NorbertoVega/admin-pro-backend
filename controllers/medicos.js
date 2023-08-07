const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {

    try {
        const medicos = await Medico.find()
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');

        res.json({
            ok: true,
            medicos
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

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({ usuario: uid , ...req.body });

    try {
        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
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

const actualizarMedico = async (req, res = response) => {

    try {

        const id = req.params.id;
        const uid = req.uid;

        const medicoDB = await Medico.findById(id);

        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado',
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
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

const borrarMedico = async (req, res = response) => {

    try {
        const id = req.params.id;

        const medicoDB = await Medico.findById(id);

        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado',
            });
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Médico eliminado'
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

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}