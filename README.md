# Hotel Leyton - Sistema de Gestión Hotelera Distribuido

Plataforma web transaccional basada en una **Arquitectura de Microservicios** desacoplados para la gestión de reservas, inventario de habitaciones, catálogo de servicios adicionales, procesamiento de pagos y control de usuarios.

---

## Arquitectura General

El sistema opera bajo un esquema multiservidor:
* **Frontend (Servidor 1 - Apache):** Interfaz web cliente desarrollada en HTML5, CSS3 (Bootstrap 5) y JavaScript asíncrono con **Axios**.
* **Backend (Servidor 2 - Node.js/Express):** 5 Microservicios independientes expuestos a través de **API REST** protegidas con autenticación basada en **JWT (JSON Web Tokens)**.
* **Persistencia (MySQL):** Bases de datos relacionales desacopladas por microservicio.

---

## Estructura del Repositorio

```text
hotel-leyton-proyecto/
├── README.md
├── .gitignore
├── servidorUbuntu1_Frontend/
│   └── capasFront/                  # Páginas HTML y scripts cliente
│       ├── index.html
│       ├── login.html
│       ├── registro.html
│       ├── ver_habitaciones.html
│       ├── ver_servicios.html
│       ├── disponibilidad.html
│       ├── crear_reserva.html
│       ├── ver_reservas.html
│       ├── insertar_pago.html
│       ├── consultar_pago.html
│       ├── gestion-reservas.html
│       ├── editar_habitacion.html
│       ├── editar_servicios.html
│       ├── editar_pagos.html
│       └── usuarios.html
│
└── servidorUbuntu2_Backend/
    ├── Database/                   # Scripts SQL independientes por microservicio
    │   ├── bd_usuarios.sql
    │   ├── db_habitacion.sql
    │   ├── bd_servicios.sql
    │   ├── db_reservas.sql
    │   └── bd_pagos.sql
    │
    ├── backendUsuarios/            # Microservicio de Usuarios (Puerto 3001)
    ├── backendHabitaciones/        # Microservicio de Habitaciones (Puerto 3002)
    ├── backendServicios/           # Microservicio de Servicios (Puerto 3000)
    ├── backendReservas/            # Microservicio de Reservas (Puerto 3003)
    └── backendPagos/               # Microservicio de Pagos (Puerto 3004)
```

---

## Tabla de Microservicios y Puertos

| Microservicio | Puerto | Base de Datos | Responsabilidad Principal |
| :--- | :--- | :--- | :--- |
| **Servicios** | `3000` | `bd_servicios` | Catálogo de servicios adicionales opcionales y tarifas |
| **Usuarios** | `3001` | `bd_usuarios` | Autenticación, registro, perfiles y emisión de JWT |
| **Habitaciones** | `3002` | `db_habitacion` | Inventario de habitaciones, precios por noche y tipos |
| **Reservas** | `3003` | `db_reservas` | Orquestación de disponibilidad, validación y reservas |
| **Pagos** | `3004` | `bd_pagos` | Procesamiento de abonos, pagos totales y comprobantes |

---

## Guía de Despliegue e Instalación

### Paso 1: Configuración de Bases de Datos en MySQL (Servidor 2)

Ingresa al servidor donde se aloja el motor de base de datos MySQL (servidorUbuntu2) y ejecuta la importación de cada script almacenado en la carpeta `servidorUbuntu2_Backend/Database/`:

# Entrar a la carpeta compartida donde clonaron el repositorio
cd /vagrant/HotelLeyton-Proyecto/Database/

# Importar las bases de datos a MySQL
```bash
mysql -u root -proot < bd_usuarios.sql
mysql -u root -proot < db_habitacion.sql
mysql -u root -proot < bd_servicios.sql
mysql -u root -proot < db_reservas.sql
mysql -u root -proot < bd_pagos.sql
```
---

### Paso 2: Despliegue del Frontend (Servidor 1 - Apache)

En el Servidor 1, copia el contenido de la carpeta `capasFront` al directorio público del servidor HTTP Apache y reinicia el servicio:

```bash
# Crear la carpeta dentro del directorio público de Apache si aun no la tienen
sudo mkdir -p /var/www/html/capasFront/

# Copiar archivos al directorio público de Apache
sudo cp -r /vagrant/HotelLeyton-Proyecto/servidorUbuntu1_Frontend/capasFront/* /var/www/html/capasFront/

# Ajustar permisos de lectura
sudo chmod -R 755 /var/www/html/capasFront

# Reiniciar el servidor Apache
sudo systemctl restart apache2
```

---

### Copiar los archivos backend dentro de servidorUbuntu2

```bash
# Copiar todos los microservicios desde la carpeta compartida a /root/
sudo cp -r /vagrant/HotelLeyton-Proyecto/servidorUbuntu2_Backend/* /root/

# Dar permisos
sudo chmod -R 755 /root/
```

### Paso 3: Despliegue y Ejecución del Backend (Servidor 2 - Node.js)

En el Servidor 2, navega a la carpeta de cada microservicio, instala las dependencias automáticas leyendo el `package.json`.

#### 1. Microservicio de Servicios (Puerto 3000)
```bash
cd /root/backendUsuarios
npm install
# Para correr el servicio:
node src/index.js
```

#### 2. Microservicio de Usuarios (Puerto 3001)
```bash
cd /root/backendHabitaciones
npm install
# Para correr el servicio:
node src/index.js
```

#### 3. Microservicio de Habitaciones (Puerto 3002)
```bash
cd /root/backendServicios
npm install
# Para correr el servicio:
node src/index.js
```

#### 4. Microservicio de Reservas (Puerto 3003)
```bash
cd /root/backendReservas
npm install
# Para correr el servicio:
node src/index.js
```

#### 5. Microservicio de Pagos (Puerto 3004)
```bash
cd /root/backendPagos
npm install
# Para correr el servicio:
node src/index.js
```



---

## Seguridad y Autenticación

1. **Tokens JWT:** El microservicio de usuarios emite un token con 24 horas de vigencia tras el inicio de sesión exitoso.
2. **Almacenamiento:** El token se almacena en `localStorage` bajo la llave `'token'` junto con el objeto de usuario en `'usuario'`.
3. **Peticiones HTTP:** Las llamadas asíncronas vía Axios envían el token en la cabecera `Authorization: Bearer <token>`.
```
eof
