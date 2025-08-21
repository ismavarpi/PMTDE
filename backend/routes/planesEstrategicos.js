const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

async function recalcObjetivos(planId) {
  const pool = getDb();
  const [[plan]] = await pool.query('SELECT codigo FROM planes_estrategicos WHERE id=?', [planId]);
  const planCode = plan ? plan.codigo : 'n/a';
  const [objs] = await pool.query('SELECT id FROM objetivos_estrategicos WHERE plan_id=? ORDER BY id', [planId]);
  for (let i = 0; i < objs.length; i++) {
    const objId = objs[i].id;
    const objCode = `${planCode}.OE${String(i + 1).padStart(2, '0')}`;
    await pool.query('UPDATE objetivos_estrategicos SET codigo=? WHERE id=?', [objCode, objId]);
    const [evs] = await pool.query(
      'SELECT id FROM objetivos_estrategicos_evidencias WHERE objetivo_id=? ORDER BY id',
      [objId]
    );
    for (let j = 0; j < evs.length; j++) {
      const evCode = `${objCode}.EV${String(j + 1).padStart(2, '0')}`;
      await pool.query(
        'UPDATE objetivos_estrategicos_evidencias SET codigo=? WHERE id=?',
        [evCode, evs[j].id]
      );
    }
  }
}

router.get('/', async (req, res) => {
  const pool = getDb();
  const [rows] = await pool.query(
    'SELECT id, codigo, pmtde_id, nombre, descripcion, responsable_id FROM planes_estrategicos'
  );
  if (rows.length === 0) return res.json([]);

  const planIds = rows.map((r) => r.id);
  const pmtdeIds = Array.from(new Set(rows.map((r) => r.pmtde_id)));
  const userIds = new Set(rows.map((r) => r.responsable_id));

  const [expertRows] = await pool.query(
    'SELECT plan_id, usuario_id FROM plan_estrategico_expertos WHERE plan_id IN (?)',
    [planIds]
  );
  expertRows.forEach((er) => userIds.add(er.usuario_id));

  const [usuariosRows] = userIds.size
    ? await pool.query('SELECT id, nombre, apellidos, email FROM usuarios WHERE id IN (?)', [Array.from(userIds)])
    : [[], []];
  const usuariosMap = {};
  usuariosRows.forEach((u) => {
    usuariosMap[u.id] = {
      id: u.id,
      nombre: u.nombre,
      apellidos: u.apellidos,
      email: u.email,
    };
  });

  const [pmtdeRows] = pmtdeIds.length
    ? await pool.query('SELECT id, nombre, descripcion, propietario_id FROM pmtde WHERE id IN (?)', [pmtdeIds])
    : [[], []];
  const pmtdeMap = {};
  pmtdeRows.forEach((p) => {
    pmtdeMap[p.id] = {
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      propietario: usuariosMap[p.propietario_id] || null,
    };
  });

  const result = rows.map((r) => ({
    id: r.id,
    codigo: r.codigo,
    pmtde: pmtdeMap[r.pmtde_id] || null,
    nombre: r.nombre,
    descripcion: r.descripcion,
    responsable: usuariosMap[r.responsable_id] || null,
    expertos: expertRows
      .filter((er) => er.plan_id === r.id)
      .map((er) => usuariosMap[er.usuario_id])
      .filter(Boolean),
  }));

  res.json(result);
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const codigo = (req.body.codigo || 'N/A').toUpperCase().substring(0, 8);
  const pmtdeId = req.body.pmtde && req.body.pmtde.id ? req.body.pmtde.id : 1;
  const nombre = req.body.nombre || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const respId =
    req.body.responsable && req.body.responsable.id ? req.body.responsable.id : 1;
  const id = req.body.id;
  if (id) {
    const [[oldPlan]] = await pool.query('SELECT codigo FROM planes_estrategicos WHERE id=?',[id]);
    await pool.query(
      'UPDATE planes_estrategicos SET codigo=?, pmtde_id=?, nombre=?, descripcion=?, responsable_id=? WHERE id=?',
      [codigo, pmtdeId, nombre, descripcion, respId, id]
    );
    if (oldPlan && oldPlan.codigo !== codigo) {
      await pool.query("UPDATE principios_especificos SET codigo=CONCAT(?, '.P', LPAD(SUBSTRING_INDEX(codigo, '.P', -1), 2, '0')) WHERE plan_id=?", [codigo, id]);
    }
    await pool.query('DELETE FROM plan_estrategico_expertos WHERE plan_id=?', [id]);
    if (Array.isArray(req.body.expertos)) {
      for (const exp of req.body.expertos) {
        const userId = exp && exp.id ? exp.id : 1;
        await pool.query(
          'INSERT INTO plan_estrategico_expertos (plan_id, usuario_id) VALUES (?, ?)',
          [id, userId]
        );
      }
    }
    await recalcObjetivos(id);
    return res.json({ id, ...req.body });
  }
  const [result] = await pool.query(
    'INSERT INTO planes_estrategicos (codigo, pmtde_id, nombre, descripcion, responsable_id) VALUES (?, ?, ?, ?, ?)',
    [codigo, pmtdeId, nombre, descripcion, respId]
  );
  const newId = result.insertId;
  if (Array.isArray(req.body.expertos)) {
    for (const exp of req.body.expertos) {
      const userId = exp && exp.id ? exp.id : 1;
      await pool.query(
        'INSERT INTO plan_estrategico_expertos (plan_id, usuario_id) VALUES (?, ?)',
        [newId, userId]
      );
    }
  }
  res.json({ id: newId, ...req.body });
});

router.put('/:id', async (req, res) => {
  const pool = getDb();
  const [[oldPlan]] = await pool.query('SELECT codigo FROM planes_estrategicos WHERE id=?',[req.params.id]);
  const codigo = (req.body.codigo || 'N/A').toUpperCase().substring(0, 8);
  const pmtdeId = req.body.pmtde && req.body.pmtde.id ? req.body.pmtde.id : 1;
  const nombre = req.body.nombre || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const respId =
    req.body.responsable && req.body.responsable.id ? req.body.responsable.id : 1;
  await pool.query(
    'UPDATE planes_estrategicos SET codigo=?, pmtde_id=?, nombre=?, descripcion=?, responsable_id=? WHERE id=?',
    [codigo, pmtdeId, nombre, descripcion, respId, req.params.id]
  );
  if (oldPlan && oldPlan.codigo !== codigo) {
    await pool.query("UPDATE principios_especificos SET codigo=CONCAT(?, '.P', LPAD(SUBSTRING_INDEX(codigo, '.P', -1), 2, '0')) WHERE plan_id=?", [codigo, req.params.id]);
  }
  await pool.query('DELETE FROM plan_estrategico_expertos WHERE plan_id=?', [
    req.params.id,
  ]);
  if (Array.isArray(req.body.expertos)) {
    for (const exp of req.body.expertos) {
      const userId = exp && exp.id ? exp.id : 1;
      await pool.query(
        'INSERT INTO plan_estrategico_expertos (plan_id, usuario_id) VALUES (?, ?)',
        [req.params.id, userId]
      );
    }
  }
  await recalcObjetivos(req.params.id);
  res.json({ id: parseInt(req.params.id, 10), ...req.body });
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  const id = req.params.id;
  if (req.query.confirm !== 'true') {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS expertos FROM plan_estrategico_expertos WHERE plan_id=?',
      [id]
    );
    return res.status(400).json({
      message: 'Confirmar eliminación',
      cascades: { expertos: rows[0].expertos },
    });
  }
  await pool.query('DELETE FROM plan_estrategico_expertos WHERE plan_id=?', [id]);
  await pool.query('DELETE FROM planes_estrategicos WHERE id=?', [id]);
  res.sendStatus(204);
});

module.exports = router;

