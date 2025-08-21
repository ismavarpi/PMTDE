function OrganizacionesManager({ organizaciones, setOrganizaciones, pmtde }) {
  const columnsConfig = [
    { key: 'codigo', label: 'Código', render: (o) => o.codigo },
    { key: 'nombre', label: 'Nombre', render: (o) => o.nombre },
    {
      key: 'pmtde',
      label: 'PMTDE',
      render: (o) => (o.pmtde ? o.pmtde.nombre : ''),
    },
  ];
  const { columns, openSelector, selector } = useColumnPreferences('organizaciones', columnsConfig);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [current, setCurrent] = React.useState({ codigo: '', nombre: '', pmtde: null });
  const [view, setView] = React.useState('table');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [pmtdeFilter, setPmtdeFilter] = React.useState([]);
  const [sortField, setSortField] = React.useState('nombre');
  const [sortDir, setSortDir] = React.useState('asc');
  const { busy, seconds, perform } = useProcessing();

  const openNew = () => {
    setCurrent({ codigo: '', nombre: '', pmtde: null });
    setDialogOpen(true);
  };

  const openEdit = (o) => {
    setCurrent(o);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    await perform(async () => {
      await organizacionesApi.save(current);
      const list = await organizacionesApi.list();
      setOrganizaciones(list);
      setDialogOpen(false);
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar organización? Esta acción es irreversible.')) return;
    perform(async () => {
      await organizacionesApi.remove(id);
      const list = await organizacionesApi.list();
      setOrganizaciones(list);
    });
  };

  const filtered = organizaciones
    .filter((o) => {
      const txt = normalize(`${o.codigo} ${o.nombre} ${o.pmtde ? o.pmtde.nombre : ''}`);
      const searchMatch = txt.includes(normalize(search));
      const pmtdeMatch = pmtdeFilter.length
        ? pmtdeFilter.some((p) => p.id === (o.pmtde && o.pmtde.id))
        : true;
      return searchMatch && pmtdeMatch;
    })
    .sort((a, b) => {
      const getVal = (obj) => {
        if (sortField === 'pmtde') {
          return normalize(obj.pmtde ? obj.pmtde.nombre : '');
        }
        return normalize(obj[sortField] || '');
      };
      const valA = getVal(a);
      const valB = getVal(b);
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const exportCSV = () => {
    const header = ['Código', 'Nombre', 'PMTDE'];
    const rows = filtered.map((o) => [o.codigo, o.nombre, o.pmtde ? o.pmtde.nombre : '']);
    exportToCSV(header, rows, 'Organizaciones');
  };

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Organizaciones', 10, 10);
    let y = 20;
    filtered.forEach((o) => {
      doc.text(`${o.codigo} - ${o.nombre} - ${o.pmtde ? o.pmtde.nombre : ''}`, 10, y);
      y += 10;
    });
    doc.save(`${formatDate()} Organizaciones.pdf`);
  };

  const resetFilters = () => {
    setSearch('');
    setPmtdeFilter([]);
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
      <Typography variant="h6" sx={{ mb: 2 }}>
        Organizaciones
      </Typography>
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
            options={pmtde}
            getOptionLabel={(p) => p.nombre}
            value={pmtdeFilter}
            onChange={(e, val) => setPmtdeFilter(val)}
            renderInput={(params) => <TextField {...params} label="PMTDE" />}
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
            <Typography variant="h6">{o.codigo} - {o.nombre}</Typography>
            <Typography variant="body2">{o.pmtde ? o.pmtde.nombre : ''}</Typography>
                <Box sx={{ mt: 1 }}>
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
        <DialogTitle>{current.id ? 'Editar organización' : 'Nueva organización'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Código*"
            value={current.codigo}
            onChange={(e) =>
              setCurrent({
                ...current,
                codigo: e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, '')
                  .slice(0, 10),
              })
            }
          />
          <TextField
            label="Nombre*"
            value={current.nombre}
            onChange={(e) => setCurrent({ ...current, nombre: e.target.value })}
          />
          <Autocomplete
            options={pmtde}
            getOptionLabel={(p) => p.nombre}
            value={current.pmtde}
            onChange={(e, val) => setCurrent({ ...current, pmtde: val })}
            renderInput={(params) => <TextField {...params} label="PMTDE*" />}
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
