const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { initDb, getDb } = require('./db');
const authRouter = require('./routes/auth');
const usuariosRouter = require('./routes/usuarios');
const pmtdeRouter = require('./routes/pmtde');
const organizacionesRouter = require('./routes/organizaciones');
const normativasRouter = require('./routes/normativas');
const inputsRouter = require('./routes/inputs');
const programasGuardarrailRouter = require('./routes/programasGuardarrail');
const principiosGuardarrailRouter = require('./routes/principiosGuardarrail');
const planesEstrategicosRouter = require('./routes/planesEstrategicos');
const principiosRouter = require('./routes/principiosEspecificos');
const dafoPlanesEstrategicosRouter = require('./routes/dafoPlanesEstrategicos');
const parametrosRouter = require('./routes/parametros');
const objetivosEstrategicosRouter = require('./routes/objetivosEstrategicos');
const objetivosEstrategicosEvidenciasRouter = require('./routes/objetivosEstrategicosEvidencias');
const objetivosGuardarrailRouter = require('./routes/objetivosGuardarrail');
const objetivosGuardarrailEvidenciasRouter = require('./routes/objetivosGuardarrailEvidencias');
const trazabilidadRouter = require('./routes/trazabilidadPrincipiosGRObjetivosGR');
const trazabilidadInputsObjetivosRouter = require('./routes/trazabilidadInputsObjetivos');
const dafoProgramasGuardarrailRouter = require('./routes/dafoProgramasGuardarrail');

const userListPreferencesRouter = require('./routes/userListPreferences');
const userPreferencesRouter = require('./routes/userPreferences');

const importExportRouter = require('./routes/importExport');
const changelogRouter = require('./routes/changelog');
const { verifyToken } = require('./token');


const app = express();
const port = process.env.NODEJS_SERVER_INSIDE_CONTAINER_PORT || 3000;
const TOKEN_EXPIRATION_MS = (parseInt(process.env.SESSION_TTL, 10) || 3600) * 1000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/api/auth', authRouter);
app.use(async (req, res, next) => {
  if (process.env.USE_AUTH !== 'true') return next();
  if (req.path.startsWith('/api/auth')) return next();
  const token = req.headers['authorization'];
  const raw = verifyToken(token);
  if (!raw) return res.status(401).json({ error: 'No autorizado' });
  try {
    const db = getDb();
    const [rows] = await db.query('SELECT username, time FROM sesiones WHERE token=?', [token]);
    if (rows.length === 0) return res.status(401).json({ error: 'No autorizado' });
    const age = Date.now() - new Date(rows[0].time).getTime();
    if (age > TOKEN_EXPIRATION_MS) {
      await db.query('DELETE FROM sesiones WHERE token=?', [token]);
      return res.status(401).json({ error: 'Token caducado' });
    }
    req.username = rows[0].username;
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api/usuarios', usuariosRouter);
app.use('/api/pmtde', pmtdeRouter);
app.use('/api/organizaciones', organizacionesRouter);
app.use('/api/normativas', normativasRouter);
app.use('/api/inputs', inputsRouter);
app.use('/api/programasGuardarrail', programasGuardarrailRouter);
app.use('/api/principiosGuardarrail', principiosGuardarrailRouter);
app.use('/api/planesEstrategicos', planesEstrategicosRouter);
app.use('/api/dafoPlanesEstrategicos', dafoPlanesEstrategicosRouter);

app.use('/api/objetivosEstrategicos', objetivosEstrategicosRouter);
app.use('/api/objetivosEstrategicosEvidencias', objetivosEstrategicosEvidenciasRouter);
app.use('/api/objetivosGuardarrail', objetivosGuardarrailRouter);
app.use('/api/objetivosGuardarrailEvidencias', objetivosGuardarrailEvidenciasRouter);
app.use('/api/trazabilidad', trazabilidadRouter);
app.use('/api/trazabilidadInputsObjetivos', trazabilidadInputsObjetivosRouter);
app.use('/api/dafoProgramasGuardarrail', dafoProgramasGuardarrailRouter);

app.use('/api/principiosEspecificos', principiosRouter);

app.use('/api/parametros', parametrosRouter);

app.use('/api/user-list-preferences', userListPreferencesRouter);
app.use('/api/user-preferences', userPreferencesRouter);

app.use('/api/import-export', importExportRouter);
app.use('/api/changelog', changelogRouter);


initDb().then(() => {
  app.listen(port, '0.0.0.0', () => {
    const url = `http://localhost:${process.env.FRONT_PORT || port}`;
    console.log(`PMTDE frontend disponible en ${url}`);
  });
});
