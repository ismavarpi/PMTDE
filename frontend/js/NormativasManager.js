function NormativasManager({ normativas, setNormativas, pmtde, organizaciones }) {
  const columnsConfig = [
    { key: 'codigo', label: 'Código', render: (n) => n.codigo },
    { key: 'nombre', label: 'Nombre', render: (n) => n.nombre },
    { key: 'tipo', label: 'Tipo', render: (n) => n.tipo },
    {
      key: 'organizacion',
      label: 'Organización',
      render: (n) => (n.organizacion ? n.organizacion.nombre : ''),
    },
    { key: 'url', label: 'URL', render: (n) => n.url },
  ];
  const tipoOptions = ['Normativa', 'Estrategia', 'Plan', 'Programa', 'Otros'];
  const { columns, openSelector, selector } = useColumnPreferences('normativas', columnsConfig);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [current, setCurrent] = React.useState({ codigo: '', nombre: '', tipo: 'Normativa', pmtde: null, organizacion: null, url: '' });
  const [view, setView] = React.useState('table');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [orgFilter, setOrgFilter] = React.useState([]);
  const [tipoFilter, setTipoFilter] = React.useState([]);
  const [sortField, setSortField] = React.useState('nombre');
  const [sortDir, setSortDir] = React.useState('asc');
  const { busy, seconds, perform } = useProcessing();

  const openNew = () => {
    setCurrent({ codigo: '', nombre: '', tipo: 'Normativa', pmtde: null, organizacion: null, url: '' });
    setDialogOpen(true);
  };

  const openEdit = (n) => {
    setCurrent(n);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    await perform(async () => {
      await normativasApi.save(current);
      const list = await normativasApi.list();
      setNormativas(list);
      setDialogOpen(false);
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar normativa? Esta acción es irreversible.')) return;
    perform(async () => {
      await normativasApi.remove(id);
      const list = await normativasApi.list();
      setNormativas(list);
    });
  };

  const filtered = normativas
    .filter((n) => {
      const txt = normalize(`${n.codigo} ${n.nombre} ${n.tipo} ${n.organizacion ? n.organizacion.nombre : ''} ${n.url}`);
      const searchMatch = txt.includes(normalize(search));
      const orgMatch = orgFilter.length
        ? orgFilter.some((o) => o.id === (n.organizacion && n.organizacion.id))
        : true;
      const tipoMatch = tipoFilter.length ? tipoFilter.includes(n.tipo) : true;
      return searchMatch && orgMatch && tipoMatch;
    })
    .sort((a, b) => {
      const getVal = (obj) => {
        if (sortField === 'organizacion') {
          return normalize(obj.organizacion ? obj.organizacion.nombre : '');
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
    const header = ['Código', 'Nombre', 'Tipo', 'Organización', 'URL'];
    const rows = filtered.map((n) => [n.codigo, n.nombre, n.tipo, n.organizacion ? n.organizacion.nombre : '', n.url]);
    exportToCSV(header, rows, 'Normativas');
  };

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Normativas', 10, 10);
    let y = 20;
    filtered.forEach((n) => {
      doc.text(`${n.codigo} - ${n.nombre} - ${n.tipo} - ${n.organizacion ? n.organizacion.nombre : ''} - ${n.url}`, 10, y);
      y += 10;
    });
    doc.save(`${formatDate()} Normativas.pdf`);
  };

  const resetFilters = () => {
    setSearch('');
    setOrgFilter([]);
    setTipoFilter([]);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDir === 'asc';
    setSortField(field);
    setSortDir(isAsc ? 'desc' : 'asc');
  };

  const orgOptions = current.pmtde
    ? organizaciones.filter((o) => o.pmtde && current.pmtde && o.pmtde.id === current.pmtde.id)
    : organizaciones;

  return (
    <Box sx={{ p: 2 }}>
      <ProcessingBanner seconds={seconds} />
      {selector}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Normativas
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
            options={organizaciones}
            getOptionLabel={(o) => o.nombre}
            value={orgFilter}
            onChange={(e, val) => setOrgFilter(val)}
            renderInput={(params) => <TextField {...params} label="Organización" />}
          />
          <Autocomplete
            multiple
            options={tipoOptions}
            value={tipoFilter}
            onChange={(e, val) => setTipoFilter(val)}
            renderInput={(params) => <TextField {...params} label="Tipo" />}
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
            {filtered.map((n) => (
              <TableRow key={n.id}>
                {columns.map((c) => (
                  <TableCell key={c.key}>{c.render(n)}</TableCell>
                ))}
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEdit(n)} disabled={busy}>
                      <span className="material-symbols-outlined">edit</span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(n.id)} disabled={busy}>
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
          {filtered.map((n) => (
            <Card key={n.id} sx={{ width: 250 }}>
              <CardContent>
                <Typography variant="h6">{n.codigo}</Typography>
                <Typography variant="body2">{n.nombre}</Typography>
                <Typography variant="body2">{n.tipo}</Typography>
                <Typography variant="body2">{n.organizacion ? n.organizacion.nombre : ''}</Typography>
                <Typography variant="body2">{n.url}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEdit(n)} disabled={busy}>
                      <span className="material-symbols-outlined">edit</span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(n.id)} disabled={busy}>
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
        <DialogTitle>{current.id ? 'Editar normativa' : 'Nueva normativa'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Código*"
            value={current.codigo}
            inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }}
            onChange={(e) =>
              setCurrent({ ...current, codigo: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })
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
            onChange={(e, val) => setCurrent({ ...current, pmtde: val, organizacion: null })}
            renderInput={(params) => <TextField {...params} label="PMTDE*" />}
          />
          <Autocomplete
            options={orgOptions}
            getOptionLabel={(o) => o.nombre}
            value={current.organizacion}
            onChange={(e, val) => setCurrent({ ...current, organizacion: val })}
            renderInput={(params) => <TextField {...params} label="Organización*" />}
          />
          <Autocomplete
            options={tipoOptions}
            value={current.tipo}
            onChange={(e, val) => setCurrent({ ...current, tipo: val })}
            renderInput={(params) => <TextField {...params} label="Tipo*" />}
          />
          <TextField
            label="URL"
            value={current.url}
            onChange={(e) => setCurrent({ ...current, url: e.target.value })}
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
