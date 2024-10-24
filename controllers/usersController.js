//importando clase Usuario y sus metodos
const { errors } = require('pg-promise');
const User = require('../models/users');
const Rol = require('../models/rol');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage.js');

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

    async findById(req,res,next){
        try {
            const id=req.params.id;


            // el await espera a terminar para pasar a la sigueinte linea de codigo
            const data= await User.findbyUserId(id);
            //console.log(` `);
            console.log(`Usuario:${data}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                messague:  "Error al obtener los usuarios Por Id"
            });
        }
    },

    async registerWithImage(req, res, next) {
        storage.uploadFile(req, res, async () => {
            try {
                const user = req.body;
                user.image = req.publicUrl;
                const data = await User.create(user);
                    await Rol.create(data.id, 1); // ROL POR DEFECTO (CLIENTE)
                        return res.status(201).json({
                            success: true,
                            message: 'El registro se realizo correctamente, ahora inicia sesion',
                            data: data.id
                            });
    
            }
            catch (error) {
                console.log(`Error: ${error}`);
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario, Con imagen',
                    error: error
                });
            }
        });
    },

    async update(req, res, next) {
        storage.uploadFile(req, res, async () => {
            try {
                const user = req.body;
                console.log( `Datos enviasos del Usuario:: ${User}`);
                console.log(`Datos enviados del usuario: ${JSON.stringify(user)}`);
                user.image = req.publicUrl;

                User.update(user);
                return res.status(201).json({
                        success: true,
                        message: 'El registro de datos Usuario se actualizado correctamente',
                        });
    
            }
            catch (error) {
                console.log(`Error: ${error}`);
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el Actualizar usuario, Con imagen',
                    error: error
                });
            }
        });
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
                // expiresIn: '1h'     // 1 HORA Expiración del token
                expiresIn: (60*60*24)   // 1 HORA
                };
                
                const token = jwt.sign(payload, keys.secretOrKey, options);
                console.log('Generated Token:', token);               
        
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
                await User.updateToken(myUser.id, `JWT ${token}`);

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

    async logout(req, res, next) {
        try {
            const id =req.body.id;
            await User.updateToken(id,null);
            return res.status(201).json({
                success: false,
                message: 'la session dle Usuario se ha cerrado, Correctamente',
            });

        }catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al momento de hacer cierre Session',
                error: error
            });
        }
    }

};

