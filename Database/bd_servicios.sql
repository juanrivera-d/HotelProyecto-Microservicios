CREATE DATABASE IF NOT EXISTS bd_servicios;
USE bd_servicios;

DROP TABLE IF EXISTS servicio;

CREATE TABLE servicio (
  idServicio INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT DEFAULT NULL,
  precio DECIMAL(10,2) NOT NULL,
  estado ENUM('Disponible','No disponible') DEFAULT 'Disponible',
  PRIMARY KEY (idServicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos iniciales
INSERT INTO servicio (nombre, descripcion, precio, estado) VALUES
('Desayuno Buffet', 'Desayuno tipo buffet variado por persona/dia.', 25000.00, 'Disponible'),
('Spa & Masaje', 'Sesion de masajes relajantes de 45 minutos.', 70000.00, 'Disponible'),
('Transporte Aeropuerto', 'Servicio de traslado privado ida o vuelta.', 45000.00, 'Disponible');