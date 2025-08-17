function ProgramaGuardarrailManager({ programasGuardarrail, setProgramasGuardarrail, pmtde, usuarios, refreshPrincipios }) {
  const columnsConfig = [
    { key: 'pmtde', label: 'PMTDE', render: (p) => (p.pmtde ? p.pmtde.nombre : '') },
    { key: 'codigo', label: 'Código', render: (p) => p.codigo },
    { key: 'nombre', label: 'Nombre', render: (p) => p.nombre },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (p) => (
        <span dangerouslySetInnerHTML={{ __html: marked.parse(p.descripcion || '') }} />
      ),
    },
    {
      key: 'responsable',
      label: 'Responsable',
      render: (p) => (p.responsable ? `${p.responsable.nombre} ${p.responsable.apellidos}` : ''),
    },
    {
      key: 'expertos',
      label: 'Grupo de expertos',
      render: (p) => p.expertos.map((e) => e.nombre + ' ' + e.apellidos).join(', '),
    },
  ];
  const { columns, openSelector, selector } = useColumnPreferences('programas_guardarrail', columnsConfig);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [current, setCurrent] = React.useState({ pmtde: null, codigo: '', nombre: '', descripcion: '', responsable: null, expertos: [] });
  const [view, setView] = React.useState('table');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [pmtdeFilter, setPmtdeFilter] = React.useState([]);
  const [respFilter, setRespFilter] = React.useState([]);
  const [expFilter, setExpFilter] = React.useState([]);
  const [sortField, setSortField] = React.useState('nombre');
  const [sortDir, setSortDir] = React.useState('asc');
  const [expertSearch, setExpertSearch] = React.useState('');
  const { busy, seconds, perform } = useProcessing();

  const openNew = () => {
    setCurrent({ pmtde: null, codigo: '', nombre: '', descripcion: '', responsable: null, expertos: [] });
    setDialogOpen(true);
  };

  const openEdit = (pr) => {
    setCurrent(pr);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    await perform(async () => {
      await programasGuardarrailApi.save(current);
      const list = await programasGuardarrailApi.list();
      setProgramasGuardarrail(list);
      if (refreshPrincipios) await refreshPrincipios();
      setDialogOpen(false);
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar programa guardarrail y sus expertos asociados? Esta acción es irreversible.')) return;
    perform(async () => {
      await programasGuardarrailApi.remove(id);
      const list = await programasGuardarrailApi.list();
      setProgramasGuardarrail(list);
      if (refreshPrincipios) await refreshPrincipios();
    });
  };

  const filtered = programasGuardarrail
    .filter((p) => {
      const txt = normalize(
        `${p.pmtde ? p.pmtde.nombre : ''} ${p.codigo} ${p.nombre} ${p.descripcion || ''} ${
          p.responsable ? p.responsable.nombre + ' ' + p.responsable.apellidos : ''
        } ${p.expertos.map((e) => e.nombre + ' ' + e.apellidos).join(' ')}`
      );
      const searchMatch = txt.includes(normalize(search));
      const pmtdeMatch = pmtdeFilter.length
        ? pmtdeFilter.some((pf) => pf.id === (p.pmtde && p.pmtde.id))
        : true;
      const respMatch = respFilter.length
        ? respFilter.some((rf) => rf.email === (p.responsable && p.responsable.email))
        : true;
      const expMatch = expFilter.length
        ? expFilter.every((ef) => p.expertos.some((e) => e.email === ef.email))
        : true;
      return searchMatch && pmtdeMatch && respMatch && expMatch;
    })
    .sort((a, b) => {
      const getVal = (obj) => {
        if (sortField === 'pmtde') return normalize(obj.pmtde ? obj.pmtde.nombre : '');
        if (sortField === 'responsable')
          return normalize(obj.responsable ? obj.responsable.nombre + ' ' + obj.responsable.apellidos : '');
        if (sortField === 'expertos')
          return normalize(obj.expertos.map((e) => e.nombre + ' ' + e.apellidos).join(' '));
        return normalize(obj[sortField] || '');
      };
      const valA = getVal(a);
      const valB = getVal(b);
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const exportCSV = () => {
    const header = ['PMTDE', 'Código', 'Nombre', 'Descripción', 'Responsable', 'Grupo de expertos'];
    const rows = filtered.map((p) => [
      p.pmtde ? p.pmtde.nombre : '',
      p.codigo,
      p.nombre,
      p.descripcion,
      p.responsable ? p.responsable.email : '',
      p.expertos.map((e) => e.email).join(',')
    ]);
    exportToCSV(header, rows, 'ProgramasGuardarrail');
  };

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Programas Guardarrail', 10, 10);
    let y = 20;
    filtered.forEach((p) => {
      doc.text(
        `${p.codigo} - ${p.nombre} - ${p.responsable ? p.responsable.email : ''} - ${p.pmtde ? p.pmtde.nombre : ''}`,
        10,
        y
      );
      y += 10;
    });
    doc.save(`${formatDate()} ProgramasGuardarrail.pdf`);
  };

  const resetFilters = () => {
    setSearch('');
    setPmtdeFilter([]);
    setRespFilter([]);
    setExpFilter([]);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDir === 'asc';
    setSortField(field);
    setSortDir(isAsc ? 'desc' : 'asc');
  };

  const availableExperts = usuarios
    .filter((u) => !current.expertos.some((e) => e.email === u.email))
    .filter((u) =>
      normalize(`${u.nombre} ${u.apellidos} ${u.email}`).includes(normalize(expertSearch))
    );

  const addExpert = (u) => {
    setCurrent({ ...current, expertos: [...current.expertos, u] });
  };

  const removeExpert = (u) => {
    setCurrent({ ...current, expertos: current.expertos.filter((e) => e.email !== u.email) });
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
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField label="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Autocomplete
            multiple
            options={pmtde}
            getOptionLabel={(p) => p.nombre}
            value={pmtdeFilter}
            onChange={(e, val) => setPmtdeFilter(val)}
            renderInput={(params) => <TextField {...params} label="PMTDE" />}
          />
          <Autocomplete
            multiple
            options={usuarios}
            getOptionLabel={(u) => `${u.nombre} ${u.apellidos}`}
            value={respFilter}
            onChange={(e, val) => setRespFilter(val)}
            renderInput={(params) => <TextField {...params} label="Responsable" />}
          />
          <Autocomplete
            multiple
            options={usuarios}
            getOptionLabel={(u) => `${u.nombre} ${u.apellidos}`}
            value={expFilter}
            onChange={(e, val) => setExpFilter(val)}
            renderInput={(params) => <TextField {...params} label="Experto" />}
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
            {filtered.map((p) => (
              <TableRow key={p.id}>
                {columns.map((c) => (
                  <TableCell key={c.key}>{c.render(p)}</TableCell>
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
                <Typography variant="h6">{p.codigo} - {p.nombre}</Typography>
                <Typography variant="body2">{p.pmtde ? p.pmtde.nombre : ''}</Typography>
                <Typography variant="body2" component="div">
                  <span dangerouslySetInnerHTML={{ __html: marked.parse(p.descripcion || '') }} />
                </Typography>
                <Typography variant="body2">
                  {p.responsable ? `${p.responsable.nombre} ${p.responsable.apellidos}` : ''}
                </Typography>
                <Typography variant="body2">
                  {p.expertos.map((e) => e.nombre).join(', ')}
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

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{ sx: { minWidth: '50vw' } }}
      >
        <DialogTitle>{current.id ? 'Editar programa guardarrail' : 'Nuevo programa guardarrail'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Autocomplete
            options={pmtde}
            getOptionLabel={(p) => p.nombre}
            value={current.pmtde}
            onChange={(e, val) => setCurrent({ ...current, pmtde: val })}
            renderInput={(params) => <TextField {...params} label="PMTDE*" />}
          />
          <TextField
            label="Código*"
            value={current.codigo}
            inputProps={{ maxLength: 8 }}
            onChange={(e) =>
              setCurrent({ ...current, codigo: e.target.value.toUpperCase().slice(0, 8) })
            }
          />
          <TextField
            label="Nombre*"
            value={current.nombre}
            onChange={(e) => setCurrent({ ...current, nombre: e.target.value })}
          />
          <TextField
            label="Descripción*"
            multiline
            minRows={3}
            value={current.descripcion}
            onChange={(e) => setCurrent({ ...current, descripcion: e.target.value })}
          />
          <Autocomplete
            options={usuarios}
            getOptionLabel={(u) => `${u.nombre} ${u.apellidos} (${u.email})`}
            value={current.responsable}
            onChange={(e, val) => setCurrent({ ...current, responsable: val })}
            renderInput={(params) => <TextField {...params} label="Responsable*" />}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                label="Filtrar usuarios"
                value={expertSearch}
                onChange={(e) => setExpertSearch(e.target.value)}
                fullWidth
              />
              <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                {availableExperts.map((u) => (
                  <ListItemButton key={u.email} onClick={() => addExpert(u)}>
                    <ListItemText primary={`${u.nombre} ${u.apellidos}`} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1">Grupo de expertos*</Typography>
              <List sx={{ maxHeight: 200, overflow: 'auto', border: 1, borderColor: 'divider' }}>
                {current.expertos.map((u) => (
                  <ListItemButton key={u.email} onClick={() => removeExpert(u)}>
                    <ListItemText primary={`${u.nombre} ${u.apellidos}`} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={busy}>Cancelar</Button>
          <Button onClick={handleSave} disabled={busy}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

