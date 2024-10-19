const promise=require('bluebird');
// const { query } = require('express');

//objeto
const options={
    promiseLib:promise,
    query:(e)=>{}
}

//  pgp, con parametros
const pgp= require('pg-promise')(options);

//configuracion de conexion
const types=pgp.pg.types;
types.setTypeParser(1114, function (StringValue) {
    return StringValue
});

const databaseConfig={
    'host':'localhost',
    'port': 5432,
    'database':'Delivery',
    'user':'root',
    'password':'Adderlin'
};

const db = pgp(databaseConfig);
module.exports = db;
