const express = require('express');
const fs = require('fs');
const path = require('path');
const { tokenImgValidation } = require('../middlewares/authentication');

const app = express();

app.get('/images/:type/:filename', tokenImgValidation, (req, res) => {
    let type = req.params.type;
    let filename = req.params.filename;
    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${filename}`);

    if (fs.existsSync(imagePath)) {
        return res.sendFile(imagePath);
    }

    res.sendFile(path.resolve(__dirname, '../assets/no-image.jpg'));
});

module.exports = app;