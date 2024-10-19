const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

/*
//FIREBASE- ADMIN

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const upload = multer({
    storage: multer.memoryStorage()
})
*/

// Manejo de errores con morgan y cors
app.use(logger('dev'));
app.use(express.json());  // Para JSON
app.use(express.urlencoded({ extended: true }));  // Para datos de formularios
app.use(cors());
app.disable('x-powered-by');

// Rutas: instanciar rutas
const users = require('./routes/usersRoutes');

const port = process.env.PORT || 3000;
app.set('port', port);

// Rutas: llamadas a las rutas
//users(app, upload);
users(app);

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

