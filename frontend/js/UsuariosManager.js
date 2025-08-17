function UsuariosManager({ usuarios, setUsuarios }) {
  const columnsConfig = [
    { key: 'nombre', label: 'Nombre', render: (u) => u.nombre },
    { key: 'apellidos', label: 'Apellidos', render: (u) => u.apellidos },
    { key: 'email', label: 'Email', render: (u) => u.email },
  ];
  const { columns, openSelector, selector } = useColumnPreferences('usuarios', columnsConfig);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [current, setCurrent] = React.useState({ nombre: '', apellidos: '', email: '' });
  const [view, setView] = React.useState('table');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [sortField, setSortField] = React.useState('nombre');
  const [sortDir, setSortDir] = React.useState('asc');
  const { busy, seconds, perform } = useProcessing();

  const openNew = () => {
    setCurrent({ nombre: '', apellidos: '', email: '' });
    setDialogOpen(true);
  };

  const openEdit = (u) => {
    setCurrent(u);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    await perform(async () => {
      await usuariosApi.save(current);
      const list = await usuariosApi.list();
      setUsuarios(list);
      setDialogOpen(false);
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar usuario y todas sus entidades asociadas? Esta acción es irreversible.')) return;
    perform(async () => {
      await usuariosApi.remove(id);
      const list = await usuariosApi.list();
      setUsuarios(list);
    });
  };

  const filtered = usuarios
    .filter((u) => {
      const txt = normalize(`${u.nombre} ${u.apellidos} ${u.email}`);
      return txt.includes(normalize(search));
    })
    .sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const exportCSV = () => {
    const header = ['Nombre', 'Apellidos', 'Email'];
    const rows = filtered.map((u) => [u.nombre, u.apellidos, u.email]);
    exportToCSV(header, rows, 'Usuarios');
  };

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Usuarios', 10, 10);
    let y = 20;
    filtered.forEach((u) => {
      doc.text(`${u.nombre} ${u.apellidos} - ${u.email}`, 10, y);
      y += 10;
    });
    doc.save(`${formatDate()} Usuarios.pdf`);
  };

  const resetFilters = () => {
    setSearch('');
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
        <Tooltip title="Seleccionar columnas">
          <IconButton onClick={openSelector} disabled={busy}>
            <span className="material-symbols-outlined">view_column</span>
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
          <TextField
            label="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            {filtered.map((u) => (
              <TableRow key={u.id}>
                {columns.map((c) => (
                  <TableCell key={c.key}>{c.render(u)}</TableCell>
                ))}
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEdit(u)} disabled={busy}>
                      <span className="material-symbols-outlined">edit</span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(u.id)} disabled={busy}>
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
          {filtered.map((u) => (
            <Card key={u.id} sx={{ width: 250 }}>
              <CardContent>
                <Typography variant="h6">{u.nombre} {u.apellidos}</Typography>
                <Typography variant="body2">{u.email}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEdit(u)} disabled={busy}>
                      <span className="material-symbols-outlined">edit</span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(u.id)} disabled={busy}>
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
        <DialogTitle>{current.email ? 'Editar usuario' : 'Nuevo usuario'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nombre*"
            value={current.nombre}
            onChange={(e) => setCurrent({ ...current, nombre: e.target.value })}
          />
          <TextField
            label="Apellidos*"
            value={current.apellidos}
            onChange={(e) => setCurrent({ ...current, apellidos: e.target.value })}
          />
          <TextField
            label="Email*"
            value={current.email}
            onChange={(e) => setCurrent({ ...current, email: e.target.value })}
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
