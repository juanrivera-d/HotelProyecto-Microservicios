const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const reservaController = require('./controllers/reservaController');
const reservaModel = require('./models/reservaModel'); // <--- Importante para la confirmación

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Rutas de Reservas
app.get('/api/reservas/disponibilidad', async (req, res) => {
    try {
        const { fechaEntrada, fechaSalida } = req.query;
        if (!fechaEntrada || !fechaSalida) {
            return res.status(400).json({ error: 'Se requieren fechaEntrada y fechaSalida' });
        }
        const disponibles = await reservaModel.obtenerDisponibilidad(fechaEntrada, fechaSalida);
        res.json(disponibles);
    } catch (error) {
        console.error('Error al consultar disponibilidad:', error);
        res.status(500).json({ error: 'Error del servidor al consultar disponibilidad' });
    }
});

// 2. OBTENER RESERVAS (TODAS O POR USUARIO)
app.get('/api/reservas', async (req, res) => {
    try {
        const { idUsuario } = req.query;
        let reservas;
        if (idUsuario) {
            reservas = await reservaModel.obtenerReservasPorUsuario(idUsuario);
        } else {
            reservas = await reservaModel.obtenerReservas(); // <-- Nombre exacto de tu función
        }
        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ error: 'Error del servidor al obtener reservas' });
    }
});
app.post('/api/reservas', reservaController.crearReserva);
app.get('/api/reservas/:id', reservaController.obtenerReserva);
// ---> RUTA PUT PARA CONFIRMAR RESERVA DESDE PAGOS <---
// RUTA PUT PARA ACTUALIZAR ESTADO DE RESERVA (ADMIN / CLIENTE)
app.put('/api/reservas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; // Recibe 'Confirmada', 'Cancelada', 'Completada', etc.

        if (!estado) {
            return res.status(400).json({ error: 'Se requiere el campo estado' });
        }

        const resultado = await reservaModel.confirmarReserva(id, estado);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'La reserva especificada no existe' });
        }

        res.json({ mensaje: `Reserva #${id} actualizada a '${estado}' con éxito` });
    } catch (error) {
        console.error('Error al actualizar reserva:', error);
        res.status(500).json({ error: 'Error del servidor al actualizar la reserva' });
    }
});
const PORT = 3003;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Microservicio de Reservas ejecutándose en el puerto ${PORT}`);
});
