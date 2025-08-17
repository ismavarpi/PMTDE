function ProgramasManager({ usuarios }) {
  const [programas, setProgramas] = React.useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [current, setCurrent] = React.useState({ nombre: '', propietario: null });
  const [view, setView] = React.useState('table');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [ownerFilter, setOwnerFilter] = React.useState([]);
  const [sortField, setSortField] = React.useState('nombre');
  const [sortDir, setSortDir] = React.useState('asc');
  const { busy, seconds, perform } = useProcessing();

  const openNew = () => {
    setCurrent({ nombre: '', propietario: null });
    setDialogOpen(true);
  };

  const openEdit = (p) => {
    setCurrent(p);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    await perform(
      () =>
        new Promise((res) =>
          setTimeout(() => {
            setProgramas((prev) => {
              const exists = prev.find((x) => x.id === current.id);
              if (exists) {
                return prev.map((x) => (x.id === current.id ? current : x));
              }
              return [...prev, { ...current, id: Date.now() }];
            });
            setDialogOpen(false);
            res();
          }, 1500)
        )
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar PMTDE?')) return;
    perform(
      () =>
        new Promise((res) =>
          setTimeout(() => {
            setProgramas((prev) => prev.filter((p) => p.id !== id));
            res();
          }, 1500)
        )
    );
  };

  const filtered = programas
    .filter((p) => {
      const txt = normalize(`${p.nombre} ${p.propietario ? p.propietario.nombre + ' ' + p.propietario.apellidos : ''}`);
      const searchMatch = txt.includes(normalize(search));
      const ownerMatch = ownerFilter.length
        ? ownerFilter.some((o) => o.email === (p.propietario && p.propietario.email))
        : true;
      return searchMatch && ownerMatch;
    })
    .sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const exportCSV = () => {
    const header = ['Nombre', 'Propietario'];
    const rows = filtered.map((p) => [p.nombre, p.propietario ? p.propietario.email : '']);
    let csv = header.join(';') + '\n';
    rows.forEach((r) => {
      csv += r.join(';') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formatDate()} PMTDE.csv`;
    link.click();
  };

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Programas Marco', 10, 10);
    let y = 20;
    filtered.forEach((p) => {
      doc.text(`${p.nombre} - ${p.propietario ? p.propietario.email : ''}`, 10, y);
      y += 10;
    });
    doc.save(`${formatDate()} PMTDE.pdf`);
  };

  const resetFilters = () => {
    setSearch('');
    setOwnerFilter([]);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDir === 'asc';
    setSortField(field);
    setSortDir(isAsc ? 'desc' : 'asc');
  };

  return (
    <Box sx={{ p: 2 }}>
      <ProcessingBanner seconds={seconds} />
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <Tooltip title="Añadir">
          <IconButton onClick={openNew} disabled={busy}>
            <span className="material-symbols-outlined">add</span>
          </IconButton>
        </Tooltip>
        <Tooltip title="Exportar CSV">
          <IconButton onClick={exportCSV} disabled={busy}>
            <span className="material-symbols-outlined">download</span>
          </IconButton>
        </Tooltip>
        <Tooltip title="Exportar PDF">
          <IconButton onClick={exportPDF} disabled={busy}>
            <span className="material-symbols-outlined">picture_as_pdf</span>
          </IconButton>
        </Tooltip>
        <Tooltip title="Filtrar">
          <IconButton onClick={() => setFilterOpen((o) => !o)} disabled={busy}>
            <span className="material-symbols-outlined">filter_list</span>
          </IconButton>
        </Tooltip>
        <Tooltip title={view === 'table' ? 'Ver como cards' : 'Ver como tabla'}>
          <IconButton onClick={() => setView(view === 'table' ? 'cards' : 'table')} disabled={busy}>
            <span className="material-symbols-outlined">{view === 'table' ? 'dashboard' : 'table_rows'}</span>
          </IconButton>
        </Tooltip>
      </Box>

      {filterOpen && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField label="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Autocomplete
            multiple
            options={usuarios}
            getOptionLabel={(u) => `${u.nombre} ${u.apellidos}`}
            value={ownerFilter}
            onChange={(e, val) => setOwnerFilter(val)}
            renderInput={(params) => <TextField {...params} label="Propietario" />}
          />
          <Button onClick={resetFilters}>Resetear</Button>
        </Box>
      )}

      {view === 'table' ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'nombre'}
                  direction={sortDir}
                  onClick={() => handleSort('nombre')}
                >
                  Nombre del PMTDE
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'propietario'}
                  direction={sortDir}
                  onClick={() => handleSort('propietario')}
                >
                  Propietario
                </TableSortLabel>
              </TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.nombre}</TableCell>
                <TableCell>{p.propietario ? `${p.propietario.nombre} ${p.propietario.apellidos}` : ''}</TableCell>
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
                <Typography variant="h6">{p.nombre}</Typography>
                <Typography variant="body2">
                  {p.propietario ? `${p.propietario.nombre} ${p.propietario.apellidos}` : ''}
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{current.id ? 'Editar PMTDE' : 'Nuevo PMTDE'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nombre del PMTDE*"
            value={current.nombre}
            onChange={(e) => setCurrent({ ...current, nombre: e.target.value })}
          />
          <Autocomplete
            options={usuarios}
            getOptionLabel={(u) => `${u.nombre} ${u.apellidos} (${u.email})`}
            value={current.propietario}
            onChange={(e, val) => setCurrent({ ...current, propietario: val })}
            renderInput={(params) => <TextField {...params} label="Propietario*" />}
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
