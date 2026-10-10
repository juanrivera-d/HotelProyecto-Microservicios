const axios = require('axios');
const reservaModel = require('../models/reservaModel');

const URL_USUARIOS = process.env.URL_USUARIOS || 'http://127.0.0.1:3001/api/usuarios';
const URL_HABITACIONES = process.env.URL_HABITACIONES || 'http://127.0.0.1:3002/api/habitaciones';

const crearReserva = async (req, res) => {
    try {
        const { fechaEntrada, fechaSalida, idUsuario, idHabitacion, precioTotal, servicios } = req.body;
        const authHeader = req.headers.authorization;
        const config = authHeader ? { headers: { Authorization: authHeader } } : {};

        try {
            await axios.get(`${URL_USUARIOS}/${idUsuario}`, config);
        } catch (errUser) {
            console.log('Aviso: Verificación de usuario omitida:', errUser.message);
        }

        let result;
        // Si vienen servicios adicionales, usamos la transacción con servicios, sino la normal
        if (servicios && Array.isArray(servicios) && servicios.length > 0) {
            result = await reservaModel.crearReservaConServicios(
                fechaEntrada,
                fechaSalida,
                precioTotal || 0,
                idUsuario,
                idHabitacion,
                servicios
            );
        } else {
            result = await reservaModel.crearReserva(
                fechaEntrada,
                fechaSalida,
                precioTotal || 0,
                idUsuario,
                idHabitacion
            );
        }

        return res.status(201).json({
            mensaje: 'Reserva creada exitosamente',
            idReserva: result ? (result.insertId || result.idReserva) : null,
            precioTotal
        });
    } catch (error) {
        console.error('Error al insertar reserva:', error);
        if (error.codigo === 'CONFLICTO_FECHAS' || error.message.includes('ya está reservada')) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Error del servidor al insertar la reserva' });
    }
};

const consultarDisponibilidad = async (req, res) => {
    try {
        const { fechaEntrada, fechaSalida } = req.query;
        const authHeader = req.headers.authorization;
        const config = authHeader ? { headers: { Authorization: authHeader } } : {};

        // 1. Obtener todas las habitaciones desde el microservicio correspondiente
        const resHab = await axios.get(URL_HABITACIONES, config);
        const todasHabitaciones = resHab.data;

        // 2. Pasar la lista de habitaciones al modelo para filtrar las disponibles
        const habitaciones = await reservaModel.obtenerDisponibilidad(fechaEntrada, fechaSalida, todasHabitaciones);
        return res.json(habitaciones);
    } catch (error) {
        console.error('Error al consultar disponibilidad:', error);
        return res.status(500).json({ error: 'Error al consultar disponibilidad' });
    }
};

const obtenerReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const reserva = await reservaModel.obtenerReservaPorId(id);
        return res.json(reserva);
    } catch (error) {
        console.error('Error al obtener reserva:', error);
        return res.status(500).json({ error: 'Error al obtener reserva' });
    }
};

const obtenerReservasUsuario = async (req, res) => {
    try {
        // Acepta tanto si viene por parámetros de ruta (/usuario/:id) como por query string (?idUsuario=...)
        const idUsuario = req.params.idUsuario || req.query.idUsuario;

        if (!idUsuario) {
            // Si no mandan ID, por seguridad devolvemos todas las reservas (o un array vacío según prefieras)
            const todas = await reservaModel.obtenerReservas();
            return res.json(todas);
        }

        const reservas = await reservaModel.obtenerReservasPorUsuario(idUsuario);
        return res.json(reservas);
    } catch (error) {
        console.error('Error al obtener reservas del usuario:', error);
        return res.status(500).json({ error: 'Error al obtener reservas del usuario' });
    }
};

const obtenerTodasLasReservas = async (req, res) => {
    try {
        const reservas = await reservaModel.obtenerReservas();
        return res.json(reservas);
    } catch (error) {
        console.error('Error al obtener todas las reservas:', error);
        return res.status(500).json({ error: 'Error al obtener reservas' });
    }
};

const cancelarReserva = async (req, res) => {
    try {
        const { idReserva } = req.params;
        // Corregido: llamar a cancelarReserva en lugar de cancelar
        await reservaModel.cancelarReserva(idReserva);
        return res.json({ mensaje: 'Reserva cancelada con éxito' });
    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        return res.status(500).json({ error: 'Error al cancelar la reserva' });
    }
};

module.exports = {
    crearReserva,
    consultarDisponibilidad,
    obtenerReserva,
    obtenerReservasPorUsuario: obtenerReservasUsuario,
    obtenerTodasLasReservas,
    obtenerReservas: obtenerTodasLasReservas,
    cancelarReserva
};
