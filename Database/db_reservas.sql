CREATE DATABASE IF NOT EXISTS db_reservas;
USE db_reservas;

DROP TABLE IF EXISTS reserva_servicio;
DROP TABLE IF EXISTS reserva;

CREATE TABLE reserva (
  idReserva INT NOT NULL AUTO_INCREMENT,
  idUsuario INT NOT NULL,
  idHabitacion INT NOT NULL,
  fechaEntrada DATE NOT NULL,
  fechaSalida DATE NOT NULL,
  precioTotal DECIMAL(10,2) DEFAULT NULL,
  estado VARCHAR(50) DEFAULT 'Pendiente',
  fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (idReserva)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE reserva_servicio (
  idReserva INT NOT NULL,
  idServicio INT NOT NULL,
  cantidad INT DEFAULT 1,
  precioUnitario DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (idReserva, idServicio),
  CONSTRAINT fk_reserva FOREIGN KEY (idReserva) REFERENCES reserva (idReserva) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;