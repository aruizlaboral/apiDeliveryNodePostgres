// firebase-config.js
const firebaseAdmin = require('firebase-admin');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(require('../delivery-b9284-firebase.json')),
  storageBucket: 'delivery-b9284.appspot.com'
});

const bucket = firebaseAdmin.storage().bucket();

module.exports = { bucket };