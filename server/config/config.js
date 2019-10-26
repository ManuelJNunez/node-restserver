// ========================
// Puerto 
// ========================
process.env.PORT = process.env.PORT || 3000;

// ========================
// Entorno
// ========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================
// Base de datos
// ========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ========================
// Vencimiento del token
// ========================
process.env.CADUCIDAD_TOKEN = '48h';

// ========================
// SEED
// ========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ========================
// Google Client ID
// ========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '979513163579-eeutfs1t5imdd5n7i988urfv69n8e120.apps.googleusercontent.com';