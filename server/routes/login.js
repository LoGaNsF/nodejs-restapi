const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');

const app = express();
const client = new OAuth2Client(process.env.CLIENT_ID);

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

        let token = jwt.sign({ user }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_DURATION });

        res.json({ ok: true, user, token });
    });
});

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let user = await verify(token).catch(err => {
        return res.status(403).json({ ok: false, error: err });
    });

    User.findOne({ email: user.email }, (err, data) => {
        if (err) {
            return res.status(500).json({ ok: false, error: err });
        }

        if (data) {
            if (!data.google) {
                return res.status(400).json({ ok: false, message: 'Debe usar su autenticación normal' });
            } else {
                let token = jwt.sign({ user }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_DURATION });

                return res.json({ ok: true, user, token });
            }
        } else {
            user.password = ':)';
            let newUser = new User(user);

            newUser.save((err, data) => {
                if (err) {
                    return res.status(500).json({ ok: false, error: err });
                }

                let token = jwt.sign({ user: data }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_DURATION });

                return res.json({ ok: true, user: data, token });
            });
        }
    });
});

// Token verify (Google)
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });

    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true
    };
}

module.exports = app;