function ObjetivosEstrategicosManager() {
  const empty = { plan: null, titulo: '', descripcion: '', codigo: '' };
  const columnsConfig = [
    { key: 'plan', label: 'Plan', render: (o) => (o.plan ? o.plan.nombre : '') },
    { key: 'codigo', label: 'Código', render: (o) => o.codigo },
    { key: 'titulo', label: 'Título', render: (o) => o.titulo },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (o) => (
        <span dangerouslySetInnerHTML={{ __html: marked.parse(o.descripcion || '') }} />
      ),
    },
    { key: 'evidencias', label: 'Evidencias', render: (o) => o.evidencias },
  ];
  const { columns, openSelector, selector } = useColumnPreferences(
    'objetivos_estrategicos',
    columnsConfig
  );
  const [objetivos, setObjetivos] = React.useState([]);
  const [planes, setPlanes] = React.useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(empty);
  const [view, setView] = React.useState('table');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [planFilter, setPlanFilter] = React.useState([]);
  const [sortField, setSortField] = React.useState('titulo');
  const [sortDir, setSortDir] = React.useState('asc');
  const [evidDialogOpen, setEvidDialogOpen] = React.useState(false);
  const [selectedObj, setSelectedObj] = React.useState(null);
  const { busy, seconds, perform } = useProcessing();

  React.useEffect(() => {
    objetivosEstrategicosApi.list().then(setObjetivos);
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
      await objetivosEstrategicosApi.save(current);
      const list = await objetivosEstrategicosApi.list();
      setObjetivos(list);
      setDialogOpen(false);
    });
  };

  const handleDelete = (id) => {
    perform(async () => {
      const res = await objetivosEstrategicosApi.remove(id);
      if (res.status === 400 && res.cascades) {
        const cascadesMsg = Object.entries(res.cascades)
          .map(([k, v]) => `${v} ${k}`)
          .join(', ');
        const msg = `¿Eliminar objetivo y sus evidencias? Se eliminarán también: ${cascadesMsg}. Esta acción es irreversible.`;
        if (!window.confirm(msg)) return;
        await objetivosEstrategicosApi.remove(id, true);
      }
      const list = await objetivosEstrategicosApi.list();
      setObjetivos(list);
    });
  };

  const openEvidencias = (o) => {
    setSelectedObj(o);
    setEvidDialogOpen(true);
  };

  const closeEvidencias = async () => {
    setEvidDialogOpen(false);
    const list = await objetivosEstrategicosApi.list();
    setObjetivos(list);
  };

  const filtered = objetivos
    .filter((o) => {
      const txt = normalize(
        `${o.plan ? o.plan.nombre : ''} ${o.codigo} ${o.titulo} ${o.descripcion || ''}`
      );
      const searchMatch = txt.includes(normalize(search));
      const planMatch = planFilter.length
        ? planFilter.some((p) => o.plan && p.id === o.plan.id)
        : true;
      return searchMatch && planMatch;
    })
    .sort((a, b) => {
      const getVal = (obj) => {
        if (sortField === 'plan') return normalize(obj.plan ? obj.plan.nombre : '');
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
    const header = ['Plan', 'Código', 'Título', 'Descripción', 'Evidencias'];
    const rows = filtered.map((o) => [
      o.plan ? o.plan.nombre : '',
      o.codigo,
      o.titulo,
      o.descripcion,
      o.evidencias,
    ]);
    exportToCSV(header, rows, 'ObjetivosEstrategicos');
  };

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Objetivos Estratégicos', 10, 10);
    let y = 20;
    filtered.forEach((o) => {
      doc.text(`${o.codigo} ${o.titulo}`, 10, y);
      y += 10;
    });
    doc.save(`${formatDate()} ObjetivosEstrategicos.pdf`);
  };

  const resetFilters = () => {
    setSearch('');
    setPlanFilter([]);
  };

  return (
    <Box sx={{ p: 2 }}>
      <ProcessingBanner seconds={seconds} />
      {selector}
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
            options={planes}
            getOptionLabel={(p) => p.nombre}
            value={planFilter}
            onChange={(e, val) => setPlanFilter(val)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
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
                <Typography variant="body2">{o.plan ? o.plan.nombre : ''}</Typography>
                <Typography variant="body2" component="div">
                  <span
                    dangerouslySetInnerHTML={{ __html: marked.parse(o.descripcion || '') }}
                  />
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
          {current.id ? 'Editar objetivo estratégico' : 'Nuevo objetivo estratégico'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Autocomplete
            options={planes}
            getOptionLabel={(p) => p.nombre}
            value={current.plan}
            onChange={(e, val) => setCurrent({ ...current, plan: val })}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Plan estratégico*" />}
          />
          <TextField label="Código" value={current.codigo || ''} disabled />
          <TextField
            label="Título*"
            value={current.titulo}
            onChange={(e) => setCurrent({ ...current, titulo: e.target.value })}
          />
          <TextField
            label="Descripción*"
            multiline
            minRows={3}
            value={current.descripcion}
            onChange={(e) => setCurrent({ ...current, descripcion: e.target.value })}
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
        <ObjetivosEstrategicosEvidenciasManager
          objetivo={selectedObj}
          onClose={closeEvidencias}
        />
      )}
    </Box>
  );
}
