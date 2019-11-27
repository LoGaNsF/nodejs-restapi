const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const { tokenValidation, roleGranted } = require('../middlewares/authentication');

const app = express();

app.get('/users', tokenValidation, (req, res) => {
    let start = req.query.start || 0;
    let limit = req.query.limit || 5;
    let condition = { active: true };
    
    User.find(condition, 'name email image role google active')
        .skip(Number(start))
        .limit(Number(limit))
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({ ok: false, error: err});
            }

            User.countDocuments(condition, (err, count) => {
                res.json({ ok: true, total: count, data });
            });

        });
});

app.post('/users', [tokenValidation, roleGranted], (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        role: req.body.role
    });

    user.save()
        .then(newUser => {
            res.json({ ok: true, data: newUser });
        })
        .catch(err => {
            res.status(400).json({ ok: false, data: err });
        });
});

app.put('/users/:id', [tokenValidation, roleGranted], (req, res) => {
    let body = _.pick(req.body, ['name', 'email', 'image', 'role', 'active']);
    let options = { new: true, runValidators: true };

    User.findByIdAndUpdate(req.params.id, body, options, (err, data) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err });
        }

        if (data) {
            return res.json({ ok: true, data });
        }
        
        res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
    });
});

app.delete('/users/:id', [tokenValidation, roleGranted], (req, res) => {
    // Borrado
    /* User.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err });
        }

        if (data) {
            return res.json({ ok: true, data });
        }

        res.json({ ok: false, message: 'Usuario no encontrado' });
    }); */

    // Desactivado
    User.findByIdAndUpdate(req.params.id, { active: false }, { new: true }, (err, data) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err });
        }

        if (data) {
            return res.json({ ok: true, data });
        }
        
        res.json({ ok: false, message: 'Usuario no encontrado' });
    });
});

module.exports = app;