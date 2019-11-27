const express = require('express');
const _ = require('underscore');
const Category = require('../models/category');
const { tokenValidation, roleGranted } = require('../middlewares/authentication');

const app = express();

app.get('/categories', (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, data) => {
            if (err) {
                return res.status(500).json({ ok: false, error: err});
            }

            Category.countDocuments({}, (err, count) => {
                res.json({ ok: true, total: count, data });
            });
        });
});

app.get('/categories/:id', (req, res) => {
    Category.findById(req.params.id).exec((err, data) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err });
        }
        
        if (data) {
            return res.json({ ok: true, data });
        }

        res.status(404).json({ ok: false, message: 'Categoría no encontrada' });
    });
});

app.post('/categories', tokenValidation, (req, res) => {
    let category = new Category({
        description: req.body.description,
        user: req.user._id
    });

    category.save()
        .then(newCategory => {
            res.json({ ok: true, data: newCategory });
        })
        .catch(err => {
            res.status(500).json({ ok: false, error: err });
        });
});

app.put('/categories/:id', (req, res) => {
    let body = _.pick(req.body, ['description']);
    let options = { new: true, runValidators: true };

    Category.findByIdAndUpdate(req.params.id, body, options, (err, data) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err });
        }

        if (data) {
            return res.json({ ok: true, data });
        }
        
        res.status(404).json({ ok: false, message: 'Categoría no encontrada' });
    });
});

app.delete('/categories/:id', [tokenValidation, roleGranted], (req, res) => {
    Category.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err });
        }

        if (data) {
            return res.json({ ok: true, data });
        }

        res.status(404).json({ ok: false, message: 'Categoría no encontrada' });
    });
});

module.exports = app;
