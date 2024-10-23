const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const session = require('express-session');
const passport = require('passport');

// Manejo de errores con morgan y cors
app.use(logger('dev'));
app.use(express.json());  // Para JSON
app.use(express.urlencoded({ extended: true }));  // Para datos de formularios
app.use(cors());
app.disable('x-powered-by');


// Configuración de express-session (debe ir antes de passport)
app.use(session({
    secret: 'tu_secreto_aqui', // Cambia esto a una cadena segura
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Asegúrate de cambiar a `true` cuando utilices HTTPS
  }));


// Passport: inicialización y manejo de sesiones
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


// Rutas: instanciar rutas
const users = require('./routes/usersRoutes');
//users(app, upload);
users(app);


// Configuración del puerto
const port = process.env.PORT || 3000;
app.set('port', port);



// Servidor
server.listen(port, () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`);
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: 'Ocurrió un error en el servidor',
        error: err.message
    });
});

module.exports = app;

