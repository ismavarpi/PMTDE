function DafoProgramasGuardarrailManager() {
  const tipos = ['Debilidad', 'Amenaza', 'Fortaleza', 'Oportunidad'];
  const empty = { programa: null, tipo: '', titulo: '', descripcion: '' };
  const columnsConfig = [
    { key: 'programa', label: 'Programa guardarrail', render: (d) => (d.programa ? d.programa.nombre : '') },
    { key: 'tipo', label: 'Tipo', render: (d) => d.tipo },
    { key: 'titulo', label: 'Título', render: (d) => d.titulo },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (d) => (
        <span dangerouslySetInnerHTML={{ __html: marked.parse(d.descripcion || '') }} />
      ),
    },
  ];
  const { columns, openSelector, selector } = useColumnPreferences('dafo_programas_guardarrail', columnsConfig);
  const [registros, setRegistros] = React.useState([]);
  const [programas, setProgramas] = React.useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(empty);
  const [view, setView] = React.useState('table');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [programaFilter, setProgramaFilter] = React.useState([]);
  const [tipoFilter, setTipoFilter] = React.useState([]);
  const [sortField, setSortField] = React.useState('titulo');
  const [sortDir, setSortDir] = React.useState('asc');
  const { busy, seconds, perform } = useProcessing();

  React.useEffect(() => {
    dafoProgramasGuardarrailApi.list().then(setRegistros);
    programasGuardarrailApi.list().then(setProgramas);
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
      await dafoProgramasGuardarrailApi.save(current);
      const list = await dafoProgramasGuardarrailApi.list();
      setRegistros(list);
      setDialogOpen(false);
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar registro DAFO? Esta acción es irreversible.')) return;
    perform(async () => {
      await dafoProgramasGuardarrailApi.remove(id);
      const list = await dafoProgramasGuardarrailApi.list();
      setRegistros(list);
    });
  };

  const filtered = registros
    .filter((r) => {
      const txt = normalize(
        `${r.titulo} ${r.descripcion || ''} ${r.tipo} ${r.programa ? r.programa.nombre : ''}`
      );
      const searchMatch = txt.includes(normalize(search));
      const programaMatch = programaFilter.length
        ? programaFilter.some((pf) => r.programa && pf.id === r.programa.id)
        : true;
      const tipoMatch = tipoFilter.length ? tipoFilter.includes(r.tipo) : true;
      return searchMatch && programaMatch && tipoMatch;
    })
    .sort((a, b) => {
      const getVal = (obj) => {
        if (sortField === 'programa') return normalize(obj.programa ? obj.programa.nombre : '');
        return normalize(obj[sortField] || '');
      };
      const valA = getVal(a);
      const valB = getVal(b);
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const exportCSV = () => {
    const header = ['Programa', 'Tipo', 'Título', 'Descripción'];
    const rows = filtered.map((r) => [
      r.programa ? r.programa.nombre : '',
      r.tipo,
      r.titulo,
      r.descripcion,
    ]);
    exportToCSV(header, rows, 'DafoProgramasGuardarrail');
  };

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('DAFO Programas guardarrail', 10, 10);
    let y = 20;
    filtered.forEach((r) => {
      doc.text(`${r.titulo} - ${r.tipo} - ${r.programa ? r.programa.nombre : ''}`, 10, y);
      y += 10;
    });
    doc.save(`${formatDate()} DafoProgramasGuardarrail.pdf`);
  };

  const resetFilters = () => {
    setSearch('');
    setProgramaFilter([]);
    setTipoFilter([]);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDir === 'asc';
    setSortField(field);
    setSortDir(isAsc ? 'desc' : 'asc');
  };

  return (
    <Box sx={{ p: 2 }}>
      <ProcessingBanner seconds={seconds} />
      {selector}
      <Typography variant="h6" sx={{ mb: 2 }}>DAFO Programas guardarrail</Typography>
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
            options={tipos}
            getOptionLabel={(t) => t}
            value={tipoFilter}
            onChange={(e, val) => setTipoFilter(val)}
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
                <Typography variant="body2">{r.tipo}</Typography>
                <Typography variant="body2">{r.programa ? r.programa.nombre : ''}</Typography>
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
            options={programas}
            getOptionLabel={(p) => p.nombre}
            value={current.programa}
            onChange={(e, val) => setCurrent({ ...current, programa: val })}
            renderInput={(params) => <TextField {...params} label="Programa guardarrail*" />}
          />
          <Autocomplete
            options={tipos}
            getOptionLabel={(t) => t}
            value={current.tipo}
            onChange={(e, val) => setCurrent({ ...current, tipo: val })}
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
    </Box>
  );
}
