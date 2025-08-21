function PrincipiosEspecificosManager() {
  const empty = { plan: null, codigo: '', titulo: '', descripcion: '' };
  const columnsConfig = [
    { key: 'codigo', label: 'Código', render: (p) => p.codigo },
    { key: 'plan', label: 'Plan estratégico', render: (p) => (p.plan ? p.plan.nombre : '') },
    { key: 'titulo', label: 'Título', render: (p) => p.titulo },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (p) => (
        <span dangerouslySetInnerHTML={{ __html: marked.parse(p.descripcion || '') }} />
      ),
    },
  ];
  const { columns, openSelector, selector } = useColumnPreferences('principios_especificos', columnsConfig);
  const [principios, setPrincipios] = React.useState([]);
  const [planes, setPlanes] = React.useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(empty);
  const [view, setView] = React.useState('table');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [planFilter, setPlanFilter] = React.useState([]);
  const [sortField, setSortField] = React.useState('titulo');
  const [sortDir, setSortDir] = React.useState('asc');
  const { busy, seconds, perform } = useProcessing();

  React.useEffect(() => {
    principiosEspecificosApi.list().then(setPrincipios);
    planesEstrategicosApi.list().then(setPlanes);
  }, []);

  const openNew = () => {
    setCurrent(empty);
    setDialogOpen(true);
  };

  const openEdit = (p) => {
    setCurrent(p);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    await perform(async () => {
      await principiosEspecificosApi.save(current);
      const list = await principiosEspecificosApi.list();
      setPrincipios(list);
      setDialogOpen(false);
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar principio específico? Esta acción es irreversible.')) return;
    perform(async () => {
      await principiosEspecificosApi.remove(id);
      const list = await principiosEspecificosApi.list();
      setPrincipios(list);
    });
  };

  const filtered = principios
    .filter((p) => {
      const txt = normalize(
        `${p.codigo} ${p.titulo} ${p.descripcion || ''} ${p.plan ? p.plan.nombre : ''}`
      );
      const searchMatch = txt.includes(normalize(search));
      const planMatch = planFilter.length
        ? planFilter.some((pf) => p.plan && pf.id === p.plan.id)
        : true;
      return searchMatch && planMatch;
    })
    .sort((a, b) => {
      const getVal = (obj) => {
        if (sortField === 'plan') return normalize(obj.plan ? obj.plan.nombre : '');
        return normalize(obj[sortField] || '');
      };
      const valA = getVal(a);
      const valB = getVal(b);
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const exportCSV = () => {
    const header = ['Código', 'Plan', 'Título', 'Descripción'];
    const rows = filtered.map((p) => [
      p.codigo,
      p.plan ? p.plan.nombre : '',
      p.titulo,
      p.descripcion,
    ]);
    exportToCSV(header, rows, 'principios_especificos');
  };

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Principios específicos', 10, 10);
    let y = 20;
    filtered.forEach((p) => {
      doc.text(
        `${p.codigo} - ${p.titulo} - ${p.plan ? p.plan.nombre : ''}`,
        10,
        y
      );
      y += 10;
    });
    doc.save(`${formatDate()} PrincipiosEspecificos.pdf`);
  };

  const resetFilters = () => {
    setSearch('');
    setPlanFilter([]);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDir === 'asc';
    setSortField(field);
    setSortDir(isAsc ? 'desc' : 'asc');
  };

  return (
    <Box sx={{ p: 2 }}>
      <ProcessingBanner open={busy} seconds={seconds} />
      {selector}
      <Typography variant="h6" sx={{ mb: 2 }}>Principios específicos</Typography>
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
            {filtered.map((p) => (
              <TableRow key={p.id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.render(p)}</TableCell>
                ))}
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEdit(p)} disabled={busy}>
                      <span className="material-symbols-outlined">edit</span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(p.id)} disabled={busy}>
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
          {filtered.map((p) => (
            <Card key={p.id} sx={{ width: 250 }}>
              <CardContent>
                <Typography variant="h6">{p.titulo}</Typography>
                <Typography variant="body2">{p.codigo}</Typography>
                <Typography variant="body2">{p.plan ? p.plan.nombre : ''}</Typography>
                <Typography variant="body2" component="div">
                  <span dangerouslySetInnerHTML={{ __html: marked.parse(p.descripcion || '') }} />
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEdit(p)} disabled={busy}>
                      <span className="material-symbols-outlined">edit</span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(p.id)} disabled={busy}>
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
        <DialogTitle>{current.id ? 'Editar principio específico' : 'Nuevo principio específico'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Autocomplete
            options={planes}
            getOptionLabel={(p) => p.nombre}
            value={current.plan}
            onChange={(e, val) => setCurrent({ ...current, plan: val })}
            renderInput={(params) => <TextField {...params} label="Plan estratégico*" />}
          />
          <TextField label="Código" value={current.codigo} disabled />
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={busy}>Cancelar</Button>
          <Button onClick={handleSave} disabled={busy}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
