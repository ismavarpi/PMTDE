const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { initDb } = require('./db');
const usuariosRouter = require('./routes/usuarios');
const pmtdeRouter = require('./routes/pmtde');
const programasGuardarrailRouter = require('./routes/programasGuardarrail');
const planesEstrategicosRouter = require('./routes/planesEstrategicos');
const parametrosRouter = require('./routes/parametros');
const importExportRouter = require('./routes/importExport');

const app = express();
const port = process.env.NODEJS_SERVER_INSIDE_CONTAINER_PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/api/usuarios', usuariosRouter);
app.use('/api/pmtde', pmtdeRouter);
app.use('/api/programasGuardarrail', programasGuardarrailRouter);
app.use('/api/planesEstrategicos', planesEstrategicosRouter);
app.use('/api/parametros', parametrosRouter);
app.use('/api/import-export', importExportRouter);

initDb().then(() => {
  app.listen(port, '0.0.0.0', () => {
    const url = `http://localhost:${process.env.FRONT_PORT || port}`;
    console.log(`PMTDE frontend disponible en ${url}`);
  });
});
