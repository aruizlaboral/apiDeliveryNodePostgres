const upload = require('../utils/upload');
const UsersController = require('../controllers/usersController');
const cloudstorage = require('../utils/cloud_storage')


module.exports =  (app) => {
// module.exports =  (app, upload) => {

    app.get('/api/users/getAll', UsersController.getAll);

    //app.post('/api/users/create', upload.single('image'), UsersController.registerWithImage);
    app.post('/api/users/create', upload.single('image'), UsersController.registerWithImage);
    //app.post('/api/users/create', upload.single('image'), cloudstorage.uploadFile, UsersController.registerWithImage);
    //app.post('/api/users/create', UsersController.register);
    //app.get('/api/users/:id', UsersController.getUserById);

    app.post('/api/users/login', UsersController.login);
}



// Rutas ejemplo
/*
app.get('/test',(req, res) => {
    res.send('Hola, mundo!, ruta test');
});
*/