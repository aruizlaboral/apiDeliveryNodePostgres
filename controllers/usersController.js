//importando clase Usuario y sus metodos
const { errors } = require('pg-promise');
const User = require('../models/users');
const Rol = require('../models/rol');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
//const storage = require('../utils/cloud_storage.js');

const bucket = require('../utils/firebase-config').bucket;
const { v4: uuidv4 } = require('uuid');

module.exports= {
    async getAll(req,res,next){
        try {
            // el await espera a terminar para pasar a la sigueinte linea de codigo
            const data= await User.getAll();
            //console.log(` `);
            console.log(`Usuario:${data}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                messague:  "Error al obtener los usuarios"
            });
        }
    },

    async registerWithImage(req, res, next) {
        try {
 
                    if (!req.file) {
                        return res.status(400).send('No se proporcionó ningún archivo.');
                    }
                    //DATOS DE ARCHIVO
                    const file = req.file;
                    const fileName = `${uuidv4()}_${file.originalname}`;
                    const fileUpload = bucket.file(fileName);
                
                    const blobStream = fileUpload.createWriteStream({
                        metadata: {
                        contentType: file.mimetype,
                        },
                    });
                    
                    blobStream.on('error', (error) => {
                        console.error('Error al subir el archivo:', error);
                        res.status(500).send('Error al subir el archivo.');
                    });

                    blobStream.on('finish', async () => {
                        await fileUpload.makePublic();
                        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                        const user = req.body;
                        user.image = publicUrl;
                        const data = await User.create(user);
                        await Rol.create(data.id, 1); // ROL POR DEFECTO (CLIENTE)
                                    return res.status(201).json({
                                        success: true,
                                        message: 'El registro se realizo correctamente, ahora inicia sesion',
                                        data: data.id
                                    });

                    });
                    blobStream.end(file.buffer); 
  
        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del usuario, Con imagen',
                error: error
            });
        }
    },
  


    async register(req,res,next){
        try {
            const usuario = req.body;
            console.log(`Usuario Ingresado, Desde Cliente Postman: ${JSON.stringify(usuario)}`);
            
            const data= await User.create(usuario);
            await Rol.create(data.id,1); //ROL CLIENTE, DEFAULT

                        return res.status(201).json({
                            success:true,
                            message: "Usuario creado con exito, Ahora inicie sesion",
                            data:data.id
                        });
        } catch (error) {
            console.log(`Error: ${error}`);
                return res.status(501).json({
                    success:false,
                    messague:  "Error al crear el usuario",
                    error:error
                });
        }
    },

    async login(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            console.log(`email:${email}, password:${password}`);
            const myUser = await User.findByEmail(email);

            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'El email no fue encontrado'
                });
            }

            if (User.isPasswordMatched(password, myUser.password)) {

                // Datos del payload que quieres firmar
                const payload = {
                    id: myUser.id,
                    email: myUser.email
                  };
                  
                // Opciones adicionales para el token (opcional)
                const options = {
                expiresIn: '1h' // Expiración del token
                };
                
                const token = jwt.sign(payload, keys.secretOrKey, options);
                console.log('Generated Token:', token);               
                /*
                const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey, {
                     expiresIn: (60*60*24) // 1 HORA
                    // expiresIn: (60 * 3) // 2 MINUTO
                });
                */
            
                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                }
                //await User.updateToken(myUser.id, `JWT ${token}`);
                console.log(`USUARIO ENVIADO, LOGEADO: ${data}`);


                return res.status(201).json({
                    success: true,
                    data: data,
                    message: 'El usuario ha sido autenticado'
                });
            }

            else {
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña es incorrecta'
                });
            }

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al momento de hacer login',
                error: error
            });
        }
    },

};

