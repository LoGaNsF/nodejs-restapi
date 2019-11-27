const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const Product = require('../models/product');

const app = express();

app.use(fileUpload({ useTempFiles: true }));

app.put('/uploads/:type/:id', (req, res) => {
    let id = req.params.id;
    let type = req.params.type;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ ok: false, message: 'No se ha seleccionado ningun archivo' });
    }

    // Validar tipo de subida
    let validTypes = ['products', 'users'];

    if (validTypes.indexOf(req.params.type) < 0) {
        return res.status(400).json({ ok: false, message: 'Tipo no válido' });
    }

    // Validar extension
    let file = req.files.file;
    let extension = file.name.split('.')[file.name.split('.').length - 1];
    let validExtensions = ['png', 'jpg', 'jpeg', 'gif'];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({ ok: false, message: 'Extension de archivo no permitida' });
    }

    let filename = `${id}-${new Date().getMilliseconds()}.${extension}`;
    file.mv(`uploads/${type}/${filename}`, (err) => {
        if (err) {
            return res.status(500).json({ ok: false, error: err });
        }

        if (type === 'users') {
            userImage(id, res, filename);
        } else {
            productImage(id, res, filename);
        }
    });
});

function userImage(id, res, filename) {
    User.findById(id, (err, data) => {
        if (err) {
            deleteImage(filename, 'users');
            return res.status(500).json({ ok: false, error: err });
        }
        
        if (!data) {
            deleteImage(filename, 'users');
            return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
        }

        deleteImage(data.image, 'users');

        data.image = filename;

        data.save((err, data) => {
            res.json({ ok: true, data });
        });
    });
}

function productImage(id, res, filename) {
    Product.findById(id, (err, data) => {
        if (err) {
            deleteImage(filename, 'products');
            return res.status(500).json({ ok: false, error: err });
        }
        
        if (!data) {
            deleteImage(filename, 'products');
            return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
        }

        deleteImage(data.image, 'products');

        data.image = filename;

        data.save((err, data) => {
            res.json({ ok: true, data });
        });
    });
}

function deleteImage(filename, type) {
    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${filename}`);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}

module.exports = app;