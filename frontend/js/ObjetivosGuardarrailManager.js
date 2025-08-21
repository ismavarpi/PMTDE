function ObjetivosGuardarrailManager() {
  const empty = { programa: null, titulo: '', descripcion: '', codigo: '', planes: [] };
  const columnsConfig = [
    { key: 'programa', label: 'Programa', render: (o) => (o.programa ? o.programa.nombre : '') },
    { key: 'codigo', label: 'Código', render: (o) => o.codigo },
    { key: 'titulo', label: 'Título', render: (o) => o.titulo },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (o) => <MarkdownRenderer value={o.descripcion} />,
    },
    { key: 'evidencias', label: 'Evidencias', render: (o) => o.evidencias },
    {
      key: 'planes',
      label: 'Planes',
      render: (o) => (
        <span>
          {(o.planes || []).map((p, i) => (
            <React.Fragment key={p.id}>
              <Tooltip title={p.nombre}>
                <span>{p.codigo}</span>
              </Tooltip>
              {i < (o.planes || []).length - 1 ? ', ' : ''}
            </React.Fragment>
          ))}
        </span>
      ),
    },
  ];
  const { columns, openSelector, selector } = useColumnPreferences(
    'objetivos_guardarrail',
    columnsConfig
  );
  const [objetivos, setObjetivos] = React.useState([]);
  const [programas, setProgramas] = React.useState([]);
  const [planes, setPlanes] = React.useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(empty);
  const [view, setView] = React.useState('table');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [programaFilter, setProgramaFilter] = React.useState([]);
  const [planFilter, setPlanFilter] = React.useState([]);
  const [sortField, setSortField] = React.useState('titulo');
  const [sortDir, setSortDir] = React.useState('asc');
  const [evidDialogOpen, setEvidDialogOpen] = React.useState(false);
  const [selectedObj, setSelectedObj] = React.useState(null);
  const { busy, seconds, perform } = useProcessing();

  React.useEffect(() => {
    objetivosGuardarrailApi.list().then(setObjetivos);
    programasGuardarrailApi.list().then(setProgramas);
    planesEstrategicosApi.list().then(setPlanes);
  }, []);

  const openNew = () => {
    setCurrent(empty);
    setDialogOpen(true);
  };

  const openEdit = (o) => {
    setCurrent(o);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    await perform(async () => {
      await objetivosGuardarrailApi.save(current);
      const list = await objetivosGuardarrailApi.list();
      setObjetivos(list);
      setDialogOpen(false);
    });
  };

  const handleDelete = (id) => {
    perform(async () => {
      const res = await objetivosGuardarrailApi.remove(id);
      if (res.status === 400 && res.cascades) {
        const cascadesMsg = Object.entries(res.cascades)
          .map(([k, v]) =>
            k === 'planes'
              ? `las vinculaciones con ${v} plan${v === 1 ? '' : 'es'}`
              : `${v} ${k}`
          )
          .join(', ');
        const msg = `¿Eliminar objetivo y sus evidencias? Se eliminarán también: ${cascadesMsg}. Esta acción es irreversible.`;
        if (!window.confirm(msg)) return;
        await objetivosGuardarrailApi.remove(id, true);
      }
      const list = await objetivosGuardarrailApi.list();
      setObjetivos(list);
    });
  };

  const openEvidencias = (o) => {
    setSelectedObj(o);
    setEvidDialogOpen(true);
  };

  const closeEvidencias = async () => {
    setEvidDialogOpen(false);
    const list = await objetivosGuardarrailApi.list();
    setObjetivos(list);
  };

  const filtered = objetivos
    .filter((o) => {
      const txt = normalize(
        `${
          o.programa ? o.programa.nombre : ''
        } ${o.codigo} ${o.titulo} ${o.descripcion || ''} ${(o.planes || [])
          .map((p) => `${p.codigo} ${p.nombre}`)
          .join(' ')}`
      );
      const searchMatch = txt.includes(normalize(search));
      const programaMatch = programaFilter.length
        ? programaFilter.some((p) => o.programa && p.id === o.programa.id)
        : true;
      const planMatch = planFilter.length
        ? planFilter.some((pl) => (o.planes || []).some((op) => op.id === pl.id))
        : true;
      return searchMatch && programaMatch && planMatch;
    })
    .sort((a, b) => {
      const getVal = (obj) => {
        if (sortField === 'programa') return normalize(obj.programa ? obj.programa.nombre : '');
        if (sortField === 'evidencias') return obj.evidencias;
        return normalize(obj[sortField] || '');
      };
      const valA = getVal(a);
      const valB = getVal(b);
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const exportCSV = () => {
    const header = ['Programa', 'Código', 'Título', 'Descripción', 'Evidencias', 'Planes'];
    const rows = filtered.map((o) => [
      o.programa ? o.programa.nombre : '',
      o.codigo,
      o.titulo,
      o.descripcion,
      o.evidencias,
      (o.planes || []).map((p) => p.codigo).join(', '),
    ]);
    exportToCSV(header, rows, 'ObjetivosGuardarrail');
  };

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Objetivos Guardarrail', 10, 10);
    let y = 20;
    filtered.forEach((o) => {
      doc.text(`${o.codigo} - ${o.titulo} (${o.programa ? o.programa.nombre : ''})`, 10, y);
      y += 10;
      const planesTxt = (o.planes || []).map((p) => p.codigo).join(', ');
      if (planesTxt) {
        doc.text(`Planes: ${planesTxt}`, 10, y);
        y += 10;
      }
    });
    doc.save(`${formatDate()} ObjetivosGuardarrail.pdf`);
  };

  const resetFilters = () => {
    setSearch('');
    setProgramaFilter([]);
    setPlanFilter([]);
  };

  return (
    <Box sx={{ p: 2 }}>
      <ProcessingBanner seconds={seconds} />
      {selector}
      <Typography variant="h6" sx={{ mb: 2 }}>Objetivos guardarrail</Typography>
      <ListActions
        onCreate={openNew}
        onToggleFilter={() => setFilterOpen((o) => !o)}
        onOpenColumns={openSelector}
        view={view}
        onToggleView={() => setView(view === 'table' ? 'cards' : 'table')}
        onExportCSV={exportCSV}
        onExportPDF={exportPDF}
        busy={busy}
      />
      {filterOpen && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField label="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Autocomplete
            multiple
            options={programas}
            getOptionLabel={(p) => p.nombre}
            value={programaFilter}
            onChange={(e, val) => setProgramaFilter(val)}
            renderInput={(params) => <TextField {...params} label="Programa" />}
          />
          <Autocomplete
            multiple
            options={planes}
            getOptionLabel={(p) => p.nombre}
            value={planFilter}
            onChange={(e, val) => setPlanFilter(val)}
            renderInput={(params) => <TextField {...params} label="Plan estratégico" />}
          />
          <Button onClick={resetFilters}>Resetear</Button>
        </Box>
      )}
      {view === 'table' ? (
        <Table>
          <TableHead sx={tableHeadSx}>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={c.key}>
                  <TableSortLabel
                    active={sortField === c.key}
                    direction={sortDir}
                    onClick={() => handleSort(c.key)}
                  >
                    {c.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((o) => (
              <TableRow key={o.id}>
                {columns.map((c) => (
                  <TableCell key={c.key}>{c.render(o)}</TableCell>
                ))}
                <TableCell>
                  <Tooltip title="Evidencias">
                    <IconButton onClick={() => openEvidencias(o)} disabled={busy}>
                      <span className="material-symbols-outlined">fact_check</span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEdit(o)} disabled={busy}>
                      <span className="material-symbols-outlined">edit</span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(o.id)} disabled={busy}>
                      <span className="material-symbols-outlined">delete</span>
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {filtered.map((o) => (
            <Card key={o.id} sx={{ width: 250 }}>
              <CardContent>
                <Typography variant="h6">{o.titulo}</Typography>
                <Typography variant="body2">{o.codigo}</Typography>
                <Typography variant="body2">{o.programa ? o.programa.nombre : ''}</Typography>
                <Typography variant="body2">
                  Planes:{' '}
                  {(o.planes || []).map((p, i) => (
                    <React.Fragment key={p.id}>
                      <Tooltip title={p.nombre}>
                        <span>{p.codigo}</span>
                      </Tooltip>
                      {i < (o.planes || []).length - 1 ? ', ' : ''}
                    </React.Fragment>
                  ))}
                </Typography>
                <Typography variant="body2" component="div">
                  <MarkdownRenderer value={o.descripcion} />
                </Typography>
                <Typography variant="body2">Evidencias: {o.evidencias}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Tooltip title="Evidencias">
                    <IconButton onClick={() => openEvidencias(o)} disabled={busy}>
                      <span className="material-symbols-outlined">fact_check</span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEdit(o)} disabled={busy}>
                      <span className="material-symbols-outlined">edit</span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(o.id)} disabled={busy}>
                      <span className="material-symbols-outlined">delete</span>
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} PaperProps={{ sx: { minWidth: '50vw' } }}>
        <DialogTitle>
          {current.id ? 'Editar objetivo guardarrail' : 'Nuevo objetivo guardarrail'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Autocomplete
            options={programas}
            getOptionLabel={(p) => p.nombre}
            value={current.programa}
            onChange={(e, val) => setCurrent({ ...current, programa: val })}
            renderInput={(params) => <TextField {...params} label="Programa guardarrail*" />}
          />
          <TextField label="Código" value={current.codigo || ''} disabled />
          <TextField
            label="Título*"
            value={current.titulo}
            onChange={(e) => setCurrent({ ...current, titulo: e.target.value })}
          />
          <MarkdownTextField
            label="Descripción*"
            value={current.descripcion}
            onChange={(e) => setCurrent({ ...current, descripcion: e.target.value })}
          />
          <Autocomplete
            multiple
            options={planes}
            getOptionLabel={(p) => p.nombre}
            value={current.planes}
            onChange={(e, val) => setCurrent({ ...current, planes: val })}
            renderInput={(params) => (
              <TextField {...params} label="Planes estratégicos en los que impacta*" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={busy}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={busy}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      {evidDialogOpen && selectedObj && (
        <ObjetivosGuardarrailEvidenciasManager objetivo={selectedObj} onClose={closeEvidencias} />
      )}
    </Box>
  );
}
