const express = require('express');
const bodyParser = require('body-parser');
const app = express();

require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json('Hello World');
});

app.get('/users', (req, res) => {
    res.json('users (GET)');
});

app.post('/users', (req, res) => {
    res.json({ data: req.body });
});

app.put('/users/:id', (req, res) => {
    res.json(`User: ${req.params.id} (PUT)`);
});

app.delete('/users/:id', (req, res) => {
    res.json(`User: ${req.params.id} (DELETE)`);
});

app.listen(process.env.PORT);