const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

// Importamos el Router de habitaciones
const habitacionRouter = require('./controller/habitacionController');

const app = express();
const PORT = 3002;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'CLAVE_SECRETA_LEYTON';

// Middleware opcional para verificar Token JWT si lo requieres en el futuro
function verificarToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) return res.status(401).json({ error: 'Token no proporcionado' });

  const token = bearerHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
    req.usuario = decoded;
    next();
  });
}

// ==========================================
// MONTAR ROUTER DE HABITACIONES (/api/habitaciones)
// ==========================================
app.use('/api/habitaciones', habitacionRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Habitaciones funcionando correctamente' });
});

// Iniciar servidor escuchando en todas las interfaces de red (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Microservicio de Habitaciones ejecutándose en http://192.168.100.3:${PORT}`);
});
