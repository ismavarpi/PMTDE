function ChangelogManager() {
  const columnsConfig = [
    { key: 'tipo', label: 'Tipo', render: (c) => c.tipo === 'I' ? 'Incidencia' : 'Mejora' },
    { key: 'fecha', label: 'Fecha', render: (c) => c.fecha },
    { key: 'descripcion', label: 'Descripción', render: (c) => c.descripcion },
  ];
  const { columns, openSelector, selector } = useColumnPreferences('changelog', columnsConfig);
  const [view, setView] = React.useState('table');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState([]);
  const [sortField, setSortField] = React.useState('fecha');
  const [sortDir, setSortDir] = React.useState('desc');
  const [items, setItems] = React.useState([]);
  const [offset, setOffset] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);
  const { busy, seconds, perform } = useProcessing();

  const load = (off = 0, append = false) =>
    perform(async () => {
      const data = await changelogApi.list(off);
      setItems(append ? [...items, ...data.items] : data.items);
      setOffset(off + data.items.length);
      setHasMore(data.hasMore);
    });

  React.useEffect(() => {
    load(0, false);
  }, []);

  const filtered = items
    .filter((c) => {
      const textMatch = normalize(`${c.tipo} ${c.fecha} ${c.descripcion}`).includes(normalize(search));
      const typeMatch = typeFilter.length ? typeFilter.includes(c.tipo) : true;
      const date = new Date(c.fecha);
      const fromMatch = dateFrom ? date >= new Date(dateFrom) : true;
      const toMatch = dateTo ? date <= new Date(dateTo) : true;
      return textMatch && typeMatch && fromMatch && toMatch;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'fecha') {
        valA = new Date(valA);
        valB = new Date(valB);
      } else {
        valA = normalize(valA || '');
        valB = normalize(valB || '');
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const exportCSV = () => {
    const header = columns.map((c) => c.label);
    const rows = filtered.map((c) => columns.map((col) => c[col.key]));
    exportToCSV(header, rows, 'Changelog');
  };

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Changelog', 10, 10);
    let y = 20;
    filtered.forEach((c) => {
      doc.text(`${c.fecha} - ${c.tipo} - ${c.descripcion}`, 10, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save(`${formatDate()} Changelog.pdf`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <ProcessingBanner seconds={seconds} />
      <Typography variant="h6" sx={{ mb: 2 }}>
        Changelog
      </Typography>
      <ListActions
        onCreate={() => {}}
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
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Fecha desde"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Fecha hasta"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Autocomplete
            multiple
            options={['I', 'M']}
            getOptionLabel={(o) => (o === 'I' ? 'Incidencia' : 'Mejora')}
            value={typeFilter}
            onChange={(e, val) => setTypeFilter(val)}
            renderInput={(params) => <TextField {...params} label="Tipo" />}
            sx={{ minWidth: 200 }}
          />
          <Button
            onClick={() => {
              setSearch('');
              setDateFrom('');
              setDateTo('');
              setTypeFilter([]);
            }}
          >
            Reset
          </Button>
        </Box>
      )}

      {selector}

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
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((c, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.render ? col.render(c) : c[col.key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {filtered.map((c, i) => (
            <Card key={i} sx={{ width: 250 }}>
              <CardContent>
                <Typography variant="subtitle2">{c.fecha}</Typography>
                <Typography variant="body2">{c.tipo === 'I' ? 'Incidencia' : 'Mejora'}</Typography>
                <Typography variant="body2">{c.descripcion}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {hasMore && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button onClick={() => load(offset, true)} disabled={busy}>
            Cargar más
          </Button>
        </Box>
      )}
    </Box>
  );
}
