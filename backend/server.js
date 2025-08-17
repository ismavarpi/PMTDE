const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.NODEJS_SERVER_INSIDE_CONTAINER_PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.listen(port, '0.0.0.0', () => {
  const url = `http://localhost:${process.env.FRONT_PORT || port}`;
  console.log(`PMTDE frontend disponible en ${url}`);
});
