const express = require('express');
const _ = require('underscore');
const { tokenValidation } = require('../middlewares/authentication');

const Product = require('../models/product');

const app = express();

app.get('/products', tokenValidation, (req, res) => {
    let start = req.query.start || 0;
    let limit = req.query.limit || 5;
    let condition = { active: true };

    if (req.query.search) {
        condition.name = new RegExp(req.query.search, 'i');
    }
    
    Product.find(condition)
        .skip(Number(start))
        .limit(Number(limit))
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, data) => {
            if (err) {
                return res.status(500).json({ ok: false, error: err});
            }

            Product.countDocuments(condition, (err, count) => {
                res.json({ ok: true, total: count, data });
            });

        });
});

app.get('/products/:id', (req, res) => {
    Product.findById(req.params.id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, data) => {
            if (err) {
                return res.status(500).json({ ok: false, error: err });
            }
            
            if (data) {
                return res.json({ ok: true, data });
            }

            res.status(404).json({ ok: false, message: 'Producto no encontrado' });
        });
});

app.post('/products', tokenValidation, (req, res) => {
    let product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        user: req.user._id,
        category: req.body.category
    });

    product.save()
        .then(newProduct => {
            res.status(201).json({ ok: true, data: newProduct });
        })
        .catch(err => {
            res.status(500).json({ ok: false, error: err });
        });
});

app.put('/products/:id', tokenValidation, (req, res) => {
    let body = _.pick(req.body, ['name', 'price', 'description', 'category']);
    let options = { new: true, runValidators: true };

    Product.findByIdAndUpdate(req.params.id, body, options, (err, data) => {
        if (err) {
            return res.status(500).json({ ok: false, error: err });
        }

        if (data) {
            return res.json({ ok: true, data });
        }
        
        res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    });
});

app.delete('/products/:id', tokenValidation, (req, res) => {
    Product.findByIdAndUpdate(req.params.id, { active: false }, { new: true }, (err, data) => {
        if (err) {
            return res.status(500).json({ ok: false, error: err });
        }

        if (data) {
            return res.json({ ok: true, data });
        }
        
        res.json({ ok: false, message: 'Producto no encontrado' });
    });
});

module.exports = app;