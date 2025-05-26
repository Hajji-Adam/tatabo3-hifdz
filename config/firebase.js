// config/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "qurqn-hifdz.firebasestorage.app", // Update this line
});

const bucket = admin.storage().bucket();

module.exports = { bucket };