const upload = require('../utils/upload');
const UsersController = require('../controllers/usersController');
const cloudstorage = require('../utils/cloud_storage')
const passport  = require('passport');


module.exports =  (app) => {
// module.exports =  (app, upload) => {

    app.get('/api/users/getAll', UsersController.getAll);
    //app.get('/api/users/findById/:id', UsersController.findById);
    app.get('/api/users/findById/:id', passport.authenticate('jwt',{session:false}), UsersController.findById);
   
    
    app.post('/api/users/create', upload.single('image'), UsersController.registerWithImage);
    //app.post('/api/users/create', upload.single('image'), cloudstorage.uploadFile, UsersController.registerWithImage);
    //app.post('/api/users/create', UsersController.register);



    app.post('/api/users/login', UsersController.login);
    app.post('/api/users/login', UsersController.logout);

    ///ACTUALIZACION DE DATOS
    app.put('/api/users/update',upload.single('image'), UsersController.update);

}



// Rutas ejemplo
/*
app.get('/test',(req, res) => {
    res.send('Hola, mundo!, ruta test');
});
*/