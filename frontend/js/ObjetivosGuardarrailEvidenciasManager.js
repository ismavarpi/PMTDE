function ObjetivosGuardarrailEvidenciasManager({ objetivo, onClose }) {
  const empty = { descripcion: '', codigo: '' };
  const columnsConfig = [
    { key: 'codigo', label: 'Código', render: (e) => e.codigo },
    { key: 'descripcion', label: 'Descripción', render: (e) => e.descripcion },
  ];
  const { columns, openSelector, selector } = useColumnPreferences(
    'objetivos_guardarrail_evidencias',
    columnsConfig
  );
  const [evidencias, setEvidencias] = React.useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(empty);
  const [view, setView] = React.useState('table');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [sortField, setSortField] = React.useState('codigo');
  const [sortDir, setSortDir] = React.useState('asc');
  const { busy, seconds, perform } = useProcessing();

  React.useEffect(() => {
    objetivosGuardarrailEvidenciasApi.list(objetivo.id).then(setEvidencias);
  }, [objetivo.id]);

  const openNew = () => {
    setCurrent(empty);
    setDialogOpen(true);
  };

  const openEdit = (e) => {
    setCurrent(e);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    await perform(async () => {
      await objetivosGuardarrailEvidenciasApi.save(objetivo.id, current);
      const list = await objetivosGuardarrailEvidenciasApi.list(objetivo.id);
      setEvidencias(list);
      setDialogOpen(false);
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar evidencia? Esta acción es irreversible.')) return;
    perform(async () => {
      await objetivosGuardarrailEvidenciasApi.remove(id);
      const list = await objetivosGuardarrailEvidenciasApi.list(objetivo.id);
      setEvidencias(list);
    });
  };

  const filtered = evidencias
    .filter((e) => normalize(`${e.codigo} ${e.descripcion}`).includes(normalize(search)))
    .sort((a, b) => {
      const valA = normalize(a[sortField] || '');
      const valB = normalize(b[sortField] || '');
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
    const header = ['Código', 'Descripción'];
    const rows = filtered.map((e) => [e.codigo, e.descripcion]);
    exportToCSV(header, rows, 'Evidencias');
  };

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Evidencias', 10, 10);
    let y = 20;
    filtered.forEach((e) => {
      doc.text(`${e.codigo} - ${e.descripcion}`, 10, y);
      y += 10;
    });
    doc.save(`${formatDate()} Evidencias.pdf`);
  };

  const resetFilters = () => {
    setSearch('');
  };

  return (
    <Dialog open onClose={onClose} PaperProps={{ sx: { minWidth: '80vw' } }}>
      <DialogTitle>Evidencias de {objetivo.titulo}</DialogTitle>
      <DialogContent>
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
            <TextField label="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} />
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
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  {columns.map((c) => (
                    <TableCell key={c.key}>{c.render(e)}</TableCell>
                  ))}
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => openEdit(e)} disabled={busy}>
                        <span className="material-symbols-outlined">edit</span>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton onClick={() => handleDelete(e.id)} disabled={busy}>
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
            {filtered.map((e) => (
              <Card key={e.id} sx={{ width: 250 }}>
                <CardContent>
                  <Typography variant="h6">{e.codigo}</Typography>
                  <Typography variant="body2">{e.descripcion}</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => openEdit(e)} disabled={busy}>
                        <span className="material-symbols-outlined">edit</span>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton onClick={() => handleDelete(e.id)} disabled={busy}>
                        <span className="material-symbols-outlined">delete</span>
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          Cerrar
        </Button>
      </DialogActions>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} PaperProps={{ sx: { minWidth: '50vw' } }}>
        <DialogTitle>{current.id ? 'Editar evidencia' : 'Nueva evidencia'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
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
    </Dialog>
  );
}
