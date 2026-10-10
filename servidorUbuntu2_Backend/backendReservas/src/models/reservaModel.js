const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'db_reservas'
});

async function obtenerReservas() {
    await connection.query(`
        UPDATE reserva 
        SET estado = 'Cancelada' 
        WHERE estado = 'Pendiente' 
        AND TIMESTAMPDIFF(SECOND, fechaCreacion, NOW()) >= 120
    `).catch(() => {});

    const [rows] = await connection.query('SELECT * FROM reserva ORDER BY idReserva DESC');
    return rows;
}

async function obtenerReservaPorId(idReserva) {
    const [rows] = await connection.query('SELECT * FROM reserva WHERE idReserva = ?', [idReserva]);
    return rows[0];
}

async function verificarDisponibilidad(idHabitacion, fechaEntrada, fechaSalida) {
    await connection.query(`
        UPDATE reserva 
        SET estado = 'Cancelada' 
        WHERE estado = 'Pendiente' 
        AND TIMESTAMPDIFF(SECOND, fechaCreacion, NOW()) >= 120
    `).catch(() => {});

    const [conflictos] = await connection.query(`
        SELECT idReserva FROM reserva
        WHERE idHabitacion = ?
        AND (
            estado IN ('Confirmada', 'Abonada') 
            OR (estado = 'Pendiente' AND TIMESTAMPDIFF(SECOND, fechaCreacion, NOW()) < 120)
        )
        AND (fechaEntrada < ? AND fechaSalida > ?)
    `, [idHabitacion, fechaSalida, fechaEntrada]);
    
    return conflictos.length === 0;
}

async function crearReserva(fechaEntrada, fechaSalida, precioTotal, idUsuario, idHabitacion) {
    const disponible = await verificarDisponibilidad(idHabitacion, fechaEntrada, fechaSalida);
    if (!disponible) {
        const error = new Error('Esa habitación ya está reservada o tiene un bloqueo pendiente activo en esas fechas');
        error.codigo = 'CONFLICTO_FECHAS';
        throw error;
    }

    const [result] = await connection.query(`
        INSERT INTO reserva (fechaEntrada, fechaSalida, precioTotal, estado, idUsuario, idHabitacion, fechaCreacion)
        VALUES (?, ?, ?, 'Pendiente', ?, ?, NOW())
    `, [fechaEntrada, fechaSalida, precioTotal, idUsuario, idHabitacion]);
    return result;
}

async function crearReservaConServicios(fechaEntrada, fechaSalida, precioTotal, idUsuario, idHabitacion, servicios) {
    const disponible = await verificarDisponibilidad(idHabitacion, fechaEntrada, fechaSalida);
    if (!disponible) {
        const error = new Error('Esa habitación ya está reservada o tiene un bloqueo pendiente activo en esas fechas');
        error.codigo = 'CONFLICTO_FECHAS';
        throw error;
    }

    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        const [resReserva] = await conn.query(`
            INSERT INTO reserva (fechaEntrada, fechaSalida, precioTotal, estado, idUsuario, idHabitacion, fechaCreacion)
            VALUES (?, ?, ?, 'Pendiente', ?, ?, NOW())
        `, [fechaEntrada, fechaSalida, precioTotal, idUsuario, idHabitacion]);

        const idReserva = resReserva.insertId;

        for (const s of servicios) {
            await conn.query(`
                INSERT INTO reserva_servicio (idReserva, idServicio, cantidad, precioUnitario)
                VALUES (?, ?, 1, ?)
            `, [idReserva, s.idServicio, s.precioUnitario]);
        }

        await conn.commit();
        return resReserva;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

async function cancelarReserva(idReserva) {
    const [result] = await connection.query(
        "UPDATE reserva SET estado = 'Cancelada' WHERE idReserva = ?",
        [idReserva]
    );
    return result;
}

async function confirmarReserva(idReserva, nuevoEstado = 'Confirmada') {
    const [result] = await connection.query(
        "UPDATE reserva SET estado = ? WHERE idReserva = ?",
        [nuevoEstado, idReserva]
    );
    return result;
}

async function obtenerReservasPorUsuario(idUsuario) {
    // 1. Ejecutar auto-cancelación primero para que limpie los vencidos de este usuario
    await connection.query(`
        UPDATE reserva 
        SET estado = 'Cancelada' 
        WHERE estado = 'Pendiente' 
        AND TIMESTAMPDIFF(SECOND, fechaCreacion, NOW()) >= 120
    `).catch(() => {});

    // 2. Consultar las reservas filtradas por el usuario
    const [rows] = await connection.query('SELECT * FROM reserva WHERE idUsuario = ? ORDER BY idReserva DESC', [idUsuario]);
    return rows;
}

async function obtenerDisponibilidad(fechaEntrada, fechaSalida, todasHabitaciones) {
    await connection.query(`
        UPDATE reserva
        SET estado = 'Cancelada'
        WHERE estado = 'Pendiente'
        AND TIMESTAMPDIFF(SECOND, fechaCreacion, NOW()) >= 120
    `).catch(() => {});

    const [ocupadas] = await connection.query(`
        SELECT DISTINCT idHabitacion FROM reserva
        WHERE (
            estado IN ('Confirmada', 'Abonada')
            OR (estado = 'Pendiente' AND TIMESTAMPDIFF(SECOND, fechaCreacion, NOW()) < 120)
        )
        AND (fechaEntrada < ? AND fechaSalida > ?)
    `, [fechaSalida, fechaEntrada]);

    const idsOcupados = ocupadas.map(o => o.idHabitacion);
    return todasHabitaciones.filter(h => !idsOcupados.includes(h.idHabitacion || h.id));
}

module.exports = {
    obtenerReservas,
    obtenerReservaPorId,
    obtenerReservasPorUsuario,
    obtenerDisponibilidad,
    verificarDisponibilidad,
    crearReserva,
    crearReservaConServicios,
    cancelarReserva,
    confirmarReserva
};
