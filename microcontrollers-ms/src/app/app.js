const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${JSON.stringify(req.body)}`);
    next();
});

app.use(require('./routes/microcontrollers.routes'));

app.disable('x-powered-by');

module.exports = app;
