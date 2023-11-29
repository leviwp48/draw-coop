// User route file
const express = require("express");
const app = express.Router();

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
  });

module.exports = app;