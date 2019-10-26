const express = require('express');
const app = express();
let _ = require('underscore');

const { verificaToken } = require('../middlewares/autenticacion');
let Producto = require('../models/producto');

// =============================
// Obtener productos
// =============================
app.get('/producto', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoría
    // paginado
    let desde = req.query.from || 0;
    desde = Number(desde);
    let limite = req.query.limit || 30;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productosDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe ningún producto'
                    }
                });
            }

            res.json({
                ok: true,
                productos: productosDB
            });
        });
});


// =============================
// Obtener un producto
// =============================
app.get('/producto/:id', verificaToken, (req, res) => {
    // populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe producto con dicha ID.'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// =============================
// Buscar producto
// =============================
app.get('/producto/search/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: productosDB
            });
        });
});

// =============================
// Crear producto
// =============================
app.post('/producto', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoría del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

// =============================
// Actualizar producto
// =============================
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encuentra el producto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// =============================
// Borrar producto
// =============================
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encuentra el producto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
            mensaje: 'Producto borrado'
        });
    });
});

module.exports = app;