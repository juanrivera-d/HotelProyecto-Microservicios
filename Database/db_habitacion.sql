CREATE DATABASE IF NOT EXISTS db_habitacion;
USE db_habitacion;

DROP TABLE IF EXISTS habitacion;

CREATE TABLE habitacion (
  idHabitacion INT NOT NULL AUTO_INCREMENT,
  numeroHabitacion VARCHAR(10) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  capacidad INT NOT NULL,
  precioNoche DECIMAL(10,2) NOT NULL,
  descripcion TEXT DEFAULT NULL,
  PRIMARY KEY (idHabitacion),
  UNIQUE KEY numeroHabitacion_UNIQUE (numeroHabitacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserción de los 20 registros reales de habitaciones
INSERT INTO habitacion (idHabitacion, numeroHabitacion, tipo, capacidad, precioNoche, descripcion) VALUES
(1, '101', 'Sencilla', 2, 120000.00, 'Vista al jardín interno bonito, cama individual'),
(2, '102', 'Sencilla', 1, 120000.00, 'Vista a la calle principal, escritorio de trabajo'),
(3, '103', 'Sencilla', 1, 120000.00, 'Habitación estándar cama individual'),
(4, '104', 'Sencilla', 1, 120000.00, 'Cama individual, TV por cable'),
(5, '105', 'Sencilla', 1, 120000.00, 'En reparación de aire acondicionado'),
(6, '201', 'Doble', 2, 220000.00, 'Dos camas individuales, balcón privado'),
(7, '202', 'Doble', 2, 220000.00, 'Cama King size, baño privado amplio'),
(8, '203', 'Doble', 2, 220000.00, 'Dos camas semi-dobles'),
(9, '204', 'Doble', 2, 220000.00, 'Cama matrimonial, vista a la piscina'),
(10, '205', 'Doble', 2, 220000.00, 'Vista a la ciudad, escritorio doble'),
(11, '206', 'Doble', 2, 220000.00, 'Dos camas individuales, frigobar'),
(12, '207', 'Doble', 2, 220000.00, 'Pintura y mantenimiento general'),
(13, '301', 'Suite', 4, 450000.00, 'Suite familiar con 2 habitaciones separadas y sala'),
(14, '302', 'Suite', 4, 450000.00, 'Suite nupcial con Jacuzzi y balcón'),
(15, '303', 'Suite', 4, 450000.00, 'Suite ejecutiva con sala de reuniones y minibar'),
(16, '304', 'Suite', 4, 450000.00, 'Vista panorámica, 2 camas Queen size'),
(17, '305', 'Suite', 4, 450000.00, 'Suite de lujo con terraza privada'),
(18, '401', 'Penthouse', 8, 700000.00, 'Piso completo, Jacuzzi, terraza y cocina equipada'),
(19, '402', 'Penthouse', 8, 700000.00, 'Penthouse con vista 360, zona de BBQ y bar'),
(20, '403', 'Penthouse', 8, 700000.00, 'Penthouse VIP con acceso a elevador privado');