const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(500).json({ ok: false, error: err });
        }

        if (!user) {
            return res.status(400).json({ ok: false, message: 'Usuario o contraseña incorrecto' });
        }

        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).json({ ok: false, message: 'Usuario o contraseña incorrecto' });
        }

        let token = jwt.sign({ user }, 'secret', { expiresIn: 60 * 60 * 24 * 30});

        res.json({ ok: true, user, token });
    });
});

module.exports = app;