function PlanesEstrategicosManager({ usuarios, pmtde = [] }) {
  const empty = {
    codigo: '',
    pmtde: null,
    nombre: '',
    descripcion: '',
    responsable: null,
    expertos: [],
  };
  const columnsConfig = [
    { key: 'codigo', label: 'Código', render: (p) => p.codigo },
    { key: 'pmtde', label: 'PMTDE', render: (p) => (p.pmtde ? p.pmtde.nombre : '') },
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
  const { columns, openSelector, selector } = useColumnPreferences('planes_estrategicos', columnsConfig);
  const [planesEstrategicos, setPlanesEstrategicos] = React.useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(empty);
  const [view, setView] = React.useState('table');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [ownerFilter, setOwnerFilter] = React.useState([]);
  const [pmtdeFilter, setPmtdeFilter] = React.useState([]);
  const [expertFilter, setExpertFilter] = React.useState([]);
  const [sortField, setSortField] = React.useState('nombre');
  const [sortDir, setSortDir] = React.useState('asc');
  const [expertSearch, setExpertSearch] = React.useState('');
  const { busy, seconds, perform } = useProcessing();

  React.useEffect(() => {
    planesEstrategicosApi.list().then(setPlanesEstrategicos);
  }, []);

  const openNew = () => {
    setCurrent(empty);
    setDialogOpen(true);
  };

  const openEdit = (p) => {
    setCurrent({ ...p, expertos: p.expertos || [] });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    await perform(async () => {
      await planesEstrategicosApi.save(current);
      const list = await planesEstrategicosApi.list();
      setPlanesEstrategicos(list);
      setDialogOpen(false);
    });
  };

  const handleDelete = (id) => {
    perform(async () => {
      const res = await planesEstrategicosApi.remove(id);
      if (res.status === 400 && res.cascades) {
        const cascadesMsg = Object.entries(res.cascades)
          .map(([k, v]) => `${v} ${k}`)
          .join(', ');
        const msg = `¿Eliminar plan estratégico y sus expertos asociados? Se eliminarán también: ${cascadesMsg}. Esta acción es irreversible.`;
        if (!window.confirm(msg)) return;
        await planesEstrategicosApi.remove(id, true);
      }
      const list = await planesEstrategicosApi.list();
      setPlanesEstrategicos(list);
    });
  };

  const filtered = planesEstrategicos
    .filter((p) => {
      const txt = normalize(
        `${p.codigo} ${p.nombre} ${p.descripcion || ''} ${p.pmtde ? p.pmtde.nombre : ''} ${
          p.responsable ? p.responsable.nombre + ' ' + p.responsable.apellidos : ''
        } ${p.expertos.map((e) => e.nombre + ' ' + e.apellidos).join(' ')}`
      );
      const searchMatch = txt.includes(normalize(search));
      const ownerMatch = ownerFilter.length
        ? ownerFilter.some((o) => o.email === (p.responsable && p.responsable.email))
        : true;
      const pmtdeMatch = pmtdeFilter.length
        ? pmtdeFilter.some((pm) => p.pmtde && pm.id === p.pmtde.id)
        : true;
      const expertMatch = expertFilter.length
        ? expertFilter.some((ef) => p.expertos.some((e) => e.email === ef.email))
        : true;
      return searchMatch && ownerMatch && pmtdeMatch && expertMatch;
    })
    .sort((a, b) => {
      const getVal = (obj) => {
        if (sortField === 'pmtde') return normalize(obj.pmtde ? obj.pmtde.nombre : '');
        if (sortField === 'responsable')
          return normalize(
            obj.responsable ? obj.responsable.nombre + ' ' + obj.responsable.apellidos : ''
          );
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
    const header = ['Código', 'PMTDE', 'Nombre', 'Descripción', 'Responsable', 'Grupo de expertos'];
    const rows = filtered.map((p) => [
      p.codigo,
      p.pmtde ? p.pmtde.nombre : '',
      p.nombre,
      p.descripcion,
      p.responsable ? p.responsable.email : '',
      p.expertos.map((e) => e.email).join('|'),
    ]);
    exportToCSV(header, rows, 'PlanesEstrategicos');
  };

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Planes Estratégicos', 10, 10);
    let y = 20;
    filtered.forEach((p) => {
      doc.text(
        `${p.codigo} - ${p.nombre} - ${
          p.responsable ? p.responsable.email : ''
        } - ${p.pmtde ? p.pmtde.nombre : ''}`,
        10,
        y
      );
      y += 10;
      const experts = p.expertos.map((e) => e.email).join(', ');
      if (experts) {
        doc.text(experts, 10, y);
        y += 10;
      }
    });
    doc.save(`${formatDate()} PlanesEstrategicos.pdf`);
  };

  const resetFilters = () => {
    setSearch('');
    setOwnerFilter([]);
    setPmtdeFilter([]);
    setExpertFilter([]);
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

  const addExpert = (u) => setCurrent({ ...current, expertos: [...current.expertos, u] });
  const removeExpert = (email) =>
    setCurrent({ ...current, expertos: current.expertos.filter((e) => e.email !== email) });

  return (
    <Box sx={{ p: 2 }}>
      <ProcessingBanner seconds={seconds} />
      {selector}
      <Typography variant="h6" sx={{ mb: 2 }}>Planes estratégicos</Typography>
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
          <Autocomplete
            multiple
            options={usuarios}
            getOptionLabel={(u) => `${u.nombre} ${u.apellidos}`}
            value={ownerFilter}
            onChange={(e, val) => setOwnerFilter(val)}
            renderInput={(params) => <TextField {...params} label="Responsable" />}
          />
          <Autocomplete
            multiple
            options={usuarios}
            getOptionLabel={(u) => `${u.nombre} ${u.apellidos}`}
            value={expertFilter}
            onChange={(e, val) => setExpertFilter(val)}
            renderInput={(params) => <TextField {...params} label="Grupo de expertos" />}
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
                <Typography variant="h6">{p.nombre}</Typography>
                <Typography variant="body2">{p.codigo}</Typography>
                <Typography variant="body2">{p.pmtde ? p.pmtde.nombre : ''}</Typography>
                <Typography variant="body2" component="div">
                  <span dangerouslySetInnerHTML={{ __html: marked.parse(p.descripcion || '') }} />
                </Typography>
                <Typography variant="body2">
                  {p.responsable ? `${p.responsable.nombre} ${p.responsable.apellidos}` : ''}
                </Typography>
                <Typography variant="body2">
                  {p.expertos.map((e) => e.nombre + ' ' + e.apellidos).join(', ')}
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
        <DialogTitle>{current.id ? 'Editar plan estratégico' : 'Nuevo plan estratégico'}</DialogTitle>
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
          label="Nombre del plan*"
          value={current.nombre}
          onChange={(e) => setCurrent({ ...current, nombre: e.target.value })}
        />
          <MarkdownTextField
            label="Descripción*"
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
              <List sx={{ maxHeight: 200, overflow: 'auto', border: 1, borderColor: 'divider' }}>
                {availableExperts.map((u) => (
                  <ListItemButton key={u.email} onClick={() => addExpert(u)}>
                    <ListItemText primary={`${u.nombre} ${u.apellidos}`} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1">Seleccionados</Typography>
              <List sx={{ maxHeight: 200, overflow: 'auto', border: 1, borderColor: 'divider' }}>
                {current.expertos.map((u) => (
                  <ListItem
                    key={u.email}
                    secondaryAction={
                      <IconButton onClick={() => removeExpert(u.email)}>
                        <span className="material-symbols-outlined">close</span>
                      </IconButton>
                    }
                  >
                    <ListItemText primary={`${u.nombre} ${u.apellidos}`} />
                  </ListItem>
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

