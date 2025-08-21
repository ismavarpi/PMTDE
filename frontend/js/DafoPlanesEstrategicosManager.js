function DafoPlanesEstrategicosManager() {
  const tipoOptions = [
    { value: 'D', label: 'Debilidad' },
    { value: 'A', label: 'Amenaza' },
    { value: 'F', label: 'Fortaleza' },
    { value: 'O', label: 'Oportunidad' },
  ];
  const getTipoLabel = (val) => {
    const found = tipoOptions.find((t) => t.value === val);
    return found ? found.label : val;
  };
  const empty = { plan: null, tipo: '', titulo: '', descripcion: '' };
  const columnsConfig = [
    { key: 'plan', label: 'Plan estratégico', render: (d) => (d.plan ? d.plan.nombre : '') },
    { key: 'tipo', label: 'Tipo', render: (d) => getTipoLabel(d.tipo) },
    { key: 'titulo', label: 'Título', render: (d) => d.titulo },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (d) => (
        <span dangerouslySetInnerHTML={{ __html: marked.parse(d.descripcion || '') }} />
      ),
    },
  ];
  const { columns, openSelector, selector } = useColumnPreferences('dafo_planes_estrategicos', columnsConfig);
  const [registros, setRegistros] = React.useState([]);
  const [planes, setPlanes] = React.useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(empty);
  const [view, setView] = React.useState('table');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [planFilter, setPlanFilter] = React.useState([]);
  const [tipoFilter, setTipoFilter] = React.useState([]);
  const [sortField, setSortField] = React.useState('titulo');
  const [sortDir, setSortDir] = React.useState('asc');
  const { busy, seconds, perform } = useProcessing();

  React.useEffect(() => {
    dafoPlanesEstrategicosApi.list().then(setRegistros);
    planesEstrategicosApi.list().then(setPlanes);
  }, []);

  const openNew = () => {
    setCurrent(empty);
    setDialogOpen(true);
  };

  const openEdit = (r) => {
    setCurrent(r);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    await perform(async () => {
      await dafoPlanesEstrategicosApi.save(current);
      const list = await dafoPlanesEstrategicosApi.list();
      setRegistros(list);
      setDialogOpen(false);
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar registro DAFO? Esta acción es irreversible.')) return;
    perform(async () => {
      await dafoPlanesEstrategicosApi.remove(id);
      const list = await dafoPlanesEstrategicosApi.list();
      setRegistros(list);
    });
  };

  const filtered = registros
    .filter((r) => {
      const txt = normalize(
        `${r.titulo} ${r.descripcion || ''} ${getTipoLabel(r.tipo)} ${
          r.plan ? r.plan.nombre : ''
        }`
      );
      const searchMatch = txt.includes(normalize(search));
      const planMatch = planFilter.length
        ? planFilter.some((pf) => r.plan && pf.id === r.plan.id)
        : true;
      const tipoMatch = tipoFilter.length ? tipoFilter.includes(r.tipo) : true;
      return searchMatch && planMatch && tipoMatch;
    })
    .sort((a, b) => {
      const getVal = (obj) => {
        if (sortField === 'plan') return normalize(obj.plan ? obj.plan.nombre : '');
        if (sortField === 'tipo') return normalize(getTipoLabel(obj.tipo));
        return normalize(obj[sortField] || '');
      };
      const valA = getVal(a);
      const valB = getVal(b);
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const exportCSV = () => {
    const header = ['Plan', 'Tipo', 'Título', 'Descripción'];
    const rows = filtered.map((r) => [
      r.plan ? r.plan.nombre : '',
      getTipoLabel(r.tipo),
      r.titulo,
      r.descripcion,
    ]);
    exportToCSV(header, rows, 'DafoPlanesEstrategicos');
  };

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('DAFO Planes estratégicos', 10, 10);
    let y = 20;
    filtered.forEach((r) => {
      doc.text(
        `${r.titulo} - ${getTipoLabel(r.tipo)} - ${r.plan ? r.plan.nombre : ''}`,
        10,
        y
      );
      y += 10;
    });
    doc.save(`${formatDate()} DafoPlanesEstrategicos.pdf`);
  };

  const resetFilters = () => {
    setSearch('');
    setPlanFilter([]);
    setTipoFilter([]);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDir === 'asc';
    setSortField(field);
    setSortDir(isAsc ? 'desc' : 'asc');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        DAFO Planes estratégicos
      </Typography>
      <ListActions
        onCreate={openNew}
        onToggleFilter={() => setFilterOpen(!filterOpen)}
        onOpenColumns={openSelector}
        view={view}
        onToggleView={() => setView(view === 'table' ? 'cards' : 'table')}
        onExportCSV={exportCSV}
        onExportPDF={exportPDF}
        busy={busy}
        sx={{ mb: 2 }}
      />
      {filterOpen && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField label="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Autocomplete
            multiple
            options={planes}
            getOptionLabel={(p) => p.nombre}
            value={planFilter}
            onChange={(e, val) => setPlanFilter(val)}
            renderInput={(params) => <TextField {...params} label="Plan" />}
          />
          <Autocomplete
            multiple
            options={tipoOptions}
            getOptionLabel={(t) => t.label}
            value={tipoFilter.map((tf) => tipoOptions.find((t) => t.value === tf))}
            onChange={(e, val) => setTipoFilter(val.map((t) => t.value))}
            renderInput={(params) => <TextField {...params} label="Tipo" />}
          />
          <Button onClick={resetFilters}>Reset</Button>
        </Box>
      )}
      {view === 'table' ? (
        <Table>
          <TableHead sx={tableHeadSx}>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  <TableSortLabel
                    active={sortField === col.key}
                    direction={sortDir}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.render(r)}</TableCell>
                ))}
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEdit(r)} disabled={busy}>
                      <span className="material-symbols-outlined">edit</span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(r.id)} disabled={busy}>
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
          {filtered.map((r) => (
            <Card key={r.id} sx={{ width: 250 }}>
              <CardContent>
                <Typography variant="h6">{r.titulo}</Typography>
                <Typography variant="body2">{getTipoLabel(r.tipo)}</Typography>
                <Typography variant="body2">{r.plan ? r.plan.nombre : ''}</Typography>
                <Typography variant="body2" component="div">
                  <span dangerouslySetInnerHTML={{ __html: marked.parse(r.descripcion || '') }} />
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEdit(r)} disabled={busy}>
                      <span className="material-symbols-outlined">edit</span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(r.id)} disabled={busy}>
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
        <DialogTitle>{current.id ? 'Editar registro DAFO' : 'Nuevo registro DAFO'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Autocomplete
            options={planes}
            getOptionLabel={(p) => p.nombre}
            value={current.plan}
            onChange={(e, val) => setCurrent({ ...current, plan: val })}
            renderInput={(params) => <TextField {...params} label="Plan estratégico*" />}
          />
          <Autocomplete
            options={tipoOptions}
            getOptionLabel={(t) => t.label}
            value={tipoOptions.find((t) => t.value === current.tipo) || null}
            onChange={(e, val) =>
              setCurrent({ ...current, tipo: val ? val.value : '' })
            }
            renderInput={(params) => <TextField {...params} label="Tipo*" />}
          />
          <TextField
            label="Título*"
            value={current.titulo}
            onChange={(e) => setCurrent({ ...current, titulo: e.target.value })}
          />
          <TextField
            label="Descripción"
            multiline
            minRows={3}
            value={current.descripcion}
            onChange={(e) => setCurrent({ ...current, descripcion: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={busy}>Cancelar</Button>
          <Button onClick={handleSave} disabled={busy}>Guardar</Button>
        </DialogActions>
      </Dialog>
      <ProcessingBanner seconds={seconds} />
    </Box>
  );
}
