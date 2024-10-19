//importando configuracion
const db = require('../config/config');
const crypto = require('crypto');
//const crypto = require('node:crypto');


// creando objeto
const User = {}

//metodo para obtener  todos los usuarios
User.getAll = () => {
    const sql = `
    SELECT 
        *
    FROM
        users
    `;
    //retoname todos o 
    return db.manyOrNone(sql);
    ///return db.query(sql);
}

//metodo para obtener un usuario por id
User.findById = (id, callback) => {
    const sql = `
    SELECT 
        id,
        email,
        name, 
        lastname,
        phone,
        image,
        password, 
        session_token
    FROM 
        users
    WHERE 
	    id =$1
    `;
    return db.oneOrNone(sql, id).then(user => {callback (null, user); });
    //return db.oneOrNone(sql, id).then(user => {callback(null, user); }).catch(err => {callback(err, null);});
}


User.findByEmail = (email) => {
    const sql = `
    SELECT 
        U.id,
        U.email,
        U.name, 
        U.lastname,
        U.phone,
        U.image,
        U.password, 
        U.session_token,
		json_agg(
			json_build_object(
				'id', R.id,
				'name', R.name,
				'image', R.image,
				'route', R.route
			)
		) AS roles
    FROM 
        users AS U
	INNER JOIN
	user_has_roles as UHR	
	ON UHR.id_user=U.id
	INNER JOIN
	roles as R	
	ON R.id=UHR.id_rol
	WHERE 
	    email =$1
	GROUP BY
	U.id
    `;
return db.oneOrNone(sql,email);
}


/*
User.findByEmail = (email) => {
    const sql = `
    SELECT 
        id,
        email,
        name, 
        lastname,
        phone,
        image,
        password, 
        session_token
    FROM 
        users
    WHERE 
	    email =$1
    `;
return db.oneOrNone(sql,email);
}
*/

//metodo para crear un usuario
User.create = (user) => {
    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex');
    user.password = myPasswordHashed;

    const sql = `
    INSERT INTO
        users(
            email,
            name,
            lastname,
            phone,
            image,
            password,
            created_at,
            updated_at
        )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `;

    return db.oneOrNone(sql, [
        user.email,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        user.password,
        new Date(),
        new Date()
    ]);
}

User.isPasswordMatched = (userPassword, hash) => {
    const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex');
    if (myPasswordHashed === hash) {
        return true;
    }
    return false;
}

module.exports = User;


User.updateToken = (id, token) => {
    const sql = `
    UPDATE
        users
    SET
        session_token = $2
    WHERE
        id = $1
    `;

    return db.none(sql, [
        id,
        token
    ]);
}