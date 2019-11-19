const jwt = require('jsonwebtoken');

let tokenValidation = (req, res, next) => {
    jwt.verify(req.get('token'), process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ ok: false, error: err });
        }

        req.user = payload.user;

        next();
    });
};

let roleGranted = (req, res, next) => {
    if (req.user.role !== 'ADMIN_ROLE') {
        return res.status(403).json({ ok: false, messa: 'Role not granted to create users' });
    }

    next();
};

module.exports = {
    tokenValidation,
    roleGranted
};