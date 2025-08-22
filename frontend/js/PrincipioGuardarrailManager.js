/* global ProcessingBanner */

function PrincipioGuardarrailManager({ principiosGuardarrail, setPrincipiosGuardarrail, programasGuardarrail }) {
    const columnsConfig = [
      {
        key: 'programa',
        label: 'Programa',
        render: (p) => (p.programa ? displayName(p.programa) : ''),
      },
      { key: 'codigo', label: 'Código', render: (p) => p.codigo },
      { key: 'titulo', label: 'Título', render: (p) => displayName(p) },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (p) => <MarkdownRenderer value={p.descripcion} />,
    },
  ];
  const { columns, openSelector, selector } = useColumnPreferences('principios_guardarrail', columnsConfig);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [current, setCurrent] = React.useState({ programa: null, codigo: '', titulo: '', descripcion: '' });
  const [view, setView] = React.useState('table');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [progFilter, setProgFilter] = React.useState([]);
  const [sortField, setSortField] = React.useState('titulo');
  const [sortDir, setSortDir] = React.useState('asc');
  const { busy, seconds, perform } = useProcessing();

  const openNew = () => {
    setCurrent({ programa: null, codigo: '', titulo: '', descripcion: '' });
    setDialogOpen(true);
  };

  const openEdit = (pr) => {
    setCurrent(pr);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    await perform(async () => {
      await principiosGuardarrailApi.save(current);
      const list = await principiosGuardarrailApi.list();
      setPrincipiosGuardarrail(list);
      setDialogOpen(false);
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar principio guardarrail? Esta acción es irreversible.')) return;
    perform(async () => {
      await principiosGuardarrailApi.remove(id);
      const list = await principiosGuardarrailApi.list();
      setPrincipiosGuardarrail(list);
    });
  };

  const filtered = principiosGuardarrail
    .filter((p) => {
        const txt = normalize(
          `${p.programa ? displayName(p.programa) : ''} ${p.codigo} ${p.titulo} ${p.descripcion || ''}`
        );
      const searchMatch = txt.includes(normalize(search));
      const progMatch = progFilter.length
        ? progFilter.some((pf) => pf.id === (p.programa && p.programa.id))
        : true;
      return searchMatch && progMatch;
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
      const header = ['Programa', 'Código', 'Título', 'Descripción'];
      const rows = filtered.map((p) => [
        p.programa ? displayName(p.programa) : '',
        p.codigo,
        displayName(p),
        p.descripcion,
      ]);
    exportToCSV(header, rows, 'PrincipiosGuardarrail');
  };

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Principios Guardarrail', 10, 10);
    let y = 20;
    filtered.forEach((p) => {
        doc.text(
          `${displayName(p)} - ${p.programa ? displayName(p.programa) : ''}`,
          10,
          y
        );
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save(`${formatDate()} PrincipiosGuardarrail.pdf`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <ProcessingBanner seconds={seconds} />
      {selector}
      <Typography variant="h6" sx={{ mb: 2 }}>Principios guardarrail</Typography>
      <ListActions
        onCreate={openNew}
        onToggleFilter={() => setFilterOpen(!filterOpen)}
        onOpenColumns={openSelector}
        view={view}
        onToggleView={() => setView(view === 'table' ? 'cards' : 'table')}
        onExportCSV={exportCSV}
        onExportPDF={exportPDF}
        busy={busy}
        sx={{ mb: 2 }}
      />

      {filterOpen && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
            <Autocomplete
              multiple
              options={programasGuardarrail}
              getOptionLabel={(p) => displayName(p)}
              value={progFilter}
              onChange={(e, val) => setProgFilter(val)}
              renderInput={(params) => <TextField {...params} label="Programa" />}
              sx={{ minWidth: 200 }}
            />
          <Button onClick={() => { setSearch(''); setProgFilter([]); }}>Reset</Button>
        </Box>
      )}

      {view === 'table' ? (
        <Table>
          <TableHead sx={tableHeadSx}>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} sortDirection={sortField === col.key ? sortDir : false}>
                  <TableSortLabel
                    active={sortField === col.key}
                    direction={sortField === col.key ? sortDir : 'asc'}
                    onClick={() => {
                      const isAsc = sortField === col.key && sortDir === 'asc';
                      setSortField(col.key);
                      setSortDir(isAsc ? 'desc' : 'asc');
                    }}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.render(p)}</TableCell>
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
                  <Typography variant="h6">{displayName(p)}</Typography>
                  <Typography variant="body2">{p.programa ? displayName(p.programa) : ''}</Typography>
                <Typography variant="body2" component="div">
                  <MarkdownRenderer value={p.descripcion} />
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
        <DialogTitle>{current.id ? 'Editar principio guardarrail' : 'Nuevo principio guardarrail'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Autocomplete
              options={programasGuardarrail}
              getOptionLabel={(p) => displayName(p)}
              value={current.programa}
              onChange={(e, val) => setCurrent({ ...current, programa: val })}
              renderInput={(params) => <TextField {...params} label="Programa*" />}
            />
          <TextField label="Código" value={current.codigo} disabled />
          <TextField
            label="Título*"
            value={current.titulo}
            onChange={(e) => setCurrent({ ...current, titulo: e.target.value })}
          />
          <MarkdownTextField
            label="Descripción*"
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
