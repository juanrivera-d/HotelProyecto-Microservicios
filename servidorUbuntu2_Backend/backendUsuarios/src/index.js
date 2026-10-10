const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const hotelController = require('./controllers/hotelController');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'CLAVE_SECRETA_LEYTON';

app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json());

// Middlewares
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    req.usuario = decoded;
    next();
  });
}

function verificarRolAdmin(req, res, next) {
  if (!req.usuario || !req.usuario.rol || req.usuario.rol.toLowerCase() !== 'admin') {
    return res.status(403).json({ mensaje: 'No tienes permisos para realizar esta acción' });
  }
  next();
}

// Rutas
app.post('/api/login', hotelController.iniciarSesion);
app.post('/api/usuarios', hotelController.crearUsuario);

app.get('/api/usuarios', verificarToken, verificarRolAdmin, hotelController.listarUsuarios);
app.get('/api/usuarios/documento/:documento', verificarToken, hotelController.obtenerUsuarioPorDocumento);
app.get('/api/usuarios/:id', verificarToken, hotelController.obtenerUsuarioPorId);
app.put('/api/usuarios/:id', verificarToken, verificarRolAdmin, hotelController.actualizarUsuario);
app.put('/api/perfil', verificarToken, hotelController.actualizarMiPerfil);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Usuarios y Autenticación activa' });
});

// Captura global de errores no controlados para que NO se cierre el proceso
process.on('uncaughtException', (err) => {
  console.error('❌ EXCEPCIÓN NO CONTROLADA EN NODE:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ RECHAZO DE PROMESA NO CONTROLADO:', reason);
});

// Arrancar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Microservicio de Usuarios escuchando en puerto ${PORT}`);
  console.log(`Presiona Ctrl + C para detener el servidor.`);
  console.log(`====================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ EL PUERTO ${PORT} YA ESTÁ OCUPADO POR OTRO PROCESO.`);
  } else {
    console.error('❌ ERROR AL INICIAR EL SERVIDOR:', err);
  }
});
