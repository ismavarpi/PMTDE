function UsuariosManager({ usuarios, setUsuarios }) {
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
    await perform(
      () =>
        new Promise((res) =>
          setTimeout(() => {
            setUsuarios((prev) => {
              const exists = prev.find((p) => p.email === current.email);
              if (exists) {
                return prev.map((p) => (p.email === current.email ? current : p));
              }
              return [...prev, { ...current }];
            });
            setDialogOpen(false);
            res();
          }, 1500)
        )
    );
  };

  const handleDelete = (email) => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    perform(
      () =>
        new Promise((res) =>
          setTimeout(() => {
            setUsuarios((prev) => prev.filter((u) => u.email !== email));
            res();
          }, 1500)
        )
    );
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
    let csv = header.join(';') + '\n';
    rows.forEach((r) => {
      csv += r.join(';') + '\n';
    });
    const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formatDate()} Usuarios.csv`;
    link.click();
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
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'nombre'}
                  direction={sortDir}
                  onClick={() => handleSort('nombre')}
                >
                  Nombre
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'apellidos'}
                  direction={sortDir}
                  onClick={() => handleSort('apellidos')}
                >
                  Apellidos
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'email'}
                  direction={sortDir}
                  onClick={() => handleSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.email}>
                <TableCell>{u.nombre}</TableCell>
                <TableCell>{u.apellidos}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEdit(u)} disabled={busy}>
                      <span className="material-symbols-outlined">edit</span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(u.email)} disabled={busy}>
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
            <Card key={u.email} sx={{ width: 250 }}>
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
                    <IconButton onClick={() => handleDelete(u.email)} disabled={busy}>
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
