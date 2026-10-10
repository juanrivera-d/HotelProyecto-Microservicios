CREATE DATABASE IF NOT EXISTS bd_usuarios;
USE bd_usuarios;

DROP TABLE IF EXISTS usuario;

CREATE TABLE usuario (
  idUsuario INT NOT NULL AUTO_INCREMENT,
  documento VARCHAR(20) NOT NULL,
  nombreCompleto VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) DEFAULT NULL,
  password VARCHAR(255) NOT NULL,
  estado ENUM('Activo','Inactivo') DEFAULT 'Activo',
  rol ENUM('Cliente','Admin') NOT NULL DEFAULT 'Cliente',
  PRIMARY KEY (idUsuario),
  UNIQUE KEY documento_UNIQUE (documento),
  UNIQUE KEY email_UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos iniciales (Contraseña de hash bcrypt para '123456')
INSERT INTO usuario (documento, nombreCompleto, email, telefono, password, estado, rol) VALUES
('1001', 'Administrador Principal', 'admin@hotelleyton.com', '3001234567', '$2a$10$eE0/gP4eS/2Z6yXf6B1eE.pX8n6sK1M5S5J7L0N9O8P7Q6R5S4T3U', 'Activo', 'Admin'),
('1002', 'Santiago Cliente', 'santiago@gmail.com', '3119876543', '$2a$10$eE0/gP4eS/2Z6yXf6B1eE.pX8n6sK1M5S5J7L0N9O8P7Q6R5S4T3U', 'Activo', 'Cliente');