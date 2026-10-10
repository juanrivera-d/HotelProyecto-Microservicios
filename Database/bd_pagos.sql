CREATE DATABASE IF NOT EXISTS bd_pagos;
USE bd_pagos;

DROP TABLE IF EXISTS pago;

CREATE TABLE pago (
  idPago INT NOT NULL AUTO_INCREMENT,
  monto DECIMAL(10,2) NOT NULL,
  fechaPago DATETIME DEFAULT CURRENT_TIMESTAMP,
  metodoPago ENUM('Efectivo','Tarjeta','Transferencia') NOT NULL,
  estado ENUM('Exitoso','Pendiente','Rechazado','Reembolsado') DEFAULT 'Exitoso',
  idReserva INT NOT NULL,
  PRIMARY KEY (idPago),
  KEY idx_idReserva (idReserva)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;