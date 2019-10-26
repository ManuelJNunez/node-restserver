const jwt = require('jsonwebtoken');

// =====================
// Verificar token
// =====================
let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.data;

        next();
    });
};

// =============================
// Verifica Admin Role
// =============================
let verificaAdmin_Role = (req, res, next) => {
    let token = req.usuario;

    if (req.usuario.role == 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No tienes permiso para realizar esta acción'
            }
        });
    }
};

// =============================
// Verifica Token para imagen
// =============================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.data;

        next();
    });
};

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
};