function InputsManager({ inputs, setInputs, pmtde, normativas }) {
  const columnsConfig = [
    { key: 'titulo', label: 'Título', render: (i) => i.titulo },
    {
      key: 'normativa',
      label: 'Normativa',
      render: (i) =>
        i.normativa
          ? `${i.normativa.nombre} (${i.normativa.organizacion ? i.normativa.organizacion.nombre : ''})`
          : '',
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (i) => (
        <span dangerouslySetInnerHTML={{ __html: marked.parse(i.descripcion || '') }} />
      ),
    },
  ];
  const { columns, openSelector, selector } = useColumnPreferences('inputs', columnsConfig);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [current, setCurrent] = React.useState({ pmtde: null, normativa: null, titulo: '', descripcion: '' });
  const [view, setView] = React.useState('table');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [normFilter, setNormFilter] = React.useState([]);
  const [sortField, setSortField] = React.useState('titulo');
  const [sortDir, setSortDir] = React.useState('asc');
  const { busy, seconds, perform } = useProcessing();

  const openNew = () => {
    setCurrent({ pmtde: null, normativa: null, titulo: '', descripcion: '' });
    setDialogOpen(true);
  };

  const openEdit = (i) => {
    setCurrent(i);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    await perform(async () => {
      await inputsApi.save(current);
      const list = await inputsApi.list();
      setInputs(list);
      setDialogOpen(false);
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar input? Esta acción es irreversible.')) return;
    perform(async () => {
      await inputsApi.remove(id);
      const list = await inputsApi.list();
      setInputs(list);
    });
  };

  const filtered = inputs
    .filter((i) => {
      const normText = i.normativa
        ? `${i.normativa.nombre} ${i.normativa.organizacion ? i.normativa.organizacion.nombre : ''}`
        : '';
      const txt = normalize(`${i.titulo} ${normText} ${i.descripcion || ''}`);
      const searchMatch = txt.includes(normalize(search));
      const normMatch = normFilter.length
        ? normFilter.some((n) => n.id === (i.normativa && i.normativa.id))
        : true;
      return searchMatch && normMatch;
    })
    .sort((a, b) => {
      const getVal = (obj) => {
        if (sortField === 'normativa') {
          return normalize(
            obj.normativa ? obj.normativa.nombre : ''
          );
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
    const header = ['Título', 'Normativa', 'Descripción'];
    const rows = filtered.map((i) => [
      i.titulo,
      i.normativa
        ? `${i.normativa.nombre} (${i.normativa.organizacion ? i.normativa.organizacion.nombre : ''})`
        : '',
      i.descripcion,
    ]);
    exportToCSV(header, rows, 'Inputs');
  };

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Inputs', 10, 10);
    let y = 20;
    filtered.forEach((i) => {
      doc.text(
        `${i.titulo} - ${i.normativa ? i.normativa.nombre : ''} (${i.normativa && i.normativa.organizacion ? i.normativa.organizacion.nombre : ''})`,
        10,
        y
      );
      y += 10;
      doc.text(i.descripcion || '', 10, y);
      y += 10;
    });
    doc.save(`${formatDate()} Inputs.pdf`);
  };

  const resetFilters = () => {
    setSearch('');
    setNormFilter([]);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDir === 'asc';
    setSortField(field);
    setSortDir(isAsc ? 'desc' : 'asc');
  };

  const normativaOptions = current.pmtde
    ? normativas.filter((n) => n.pmtde && current.pmtde && n.pmtde.id === current.pmtde.id)
    : normativas;

  return (
    <Box sx={{ p: 2 }}>
      <ProcessingBanner seconds={seconds} />
      {selector}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Inputs
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
            options={normativas}
            getOptionLabel={(n) => `${n.nombre} (${n.organizacion ? n.organizacion.nombre : ''})`}
            value={normFilter}
            onChange={(e, val) => setNormFilter(val)}
            renderInput={(params) => <TextField {...params} label="Normativa" />}
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
            {filtered.map((i) => (
              <TableRow key={i.id}>
                {columns.map((c) => (
                  <TableCell key={c.key}>{c.render(i)}</TableCell>
                ))}
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEdit(i)} disabled={busy}>
                      <span className="material-symbols-outlined">edit</span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(i.id)} disabled={busy}>
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
          {filtered.map((i) => (
            <Card key={i.id} sx={{ width: 250 }}>
              <CardContent>
                <Typography variant="h6">{i.titulo}</Typography>
                <Typography variant="body2">
                  {i.normativa
                    ? `${i.normativa.nombre} (${i.normativa.organizacion ? i.normativa.organizacion.nombre : ''})`
                    : ''}
                </Typography>
                <Typography variant="body2" component="div">
                  <span dangerouslySetInnerHTML={{ __html: marked.parse(i.descripcion || '') }} />
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEdit(i)} disabled={busy}>
                      <span className="material-symbols-outlined">edit</span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(i.id)} disabled={busy}>
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
        <DialogTitle>{current.id ? 'Editar input' : 'Nuevo input'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Autocomplete
            options={pmtde}
            getOptionLabel={(p) => p.nombre}
            value={current.pmtde}
            onChange={(e, val) => setCurrent({ ...current, pmtde: val, normativa: null })}
            renderInput={(params) => <TextField {...params} label="PMTDE*" />}
          />
          <Autocomplete
            options={normativaOptions}
            getOptionLabel={(n) => `${n.nombre} (${n.organizacion ? n.organizacion.nombre : ''})`}
            value={current.normativa}
            onChange={(e, val) => setCurrent({ ...current, normativa: val })}
            renderInput={(params) => <TextField {...params} label="Normativa*" />}
          />
          <TextField
            label="Título*"
            value={current.titulo}
            onChange={(e) => setCurrent({ ...current, titulo: e.target.value })}
          />
          <MarkdownTextField
            label="Descripción"
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
