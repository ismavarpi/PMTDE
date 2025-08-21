function TrazabilidadPrincipioGRObjetivoGRManager({ programasGuardarrail }) {
  const [programa, setPrograma] = React.useState(null);
  const [principiosGR, setPrincipiosGR] = React.useState([]);
  const [objetivosGR, setObjetivosGR] = React.useState([]);
  const [relaciones, setRelaciones] = React.useState({});
  const [editing, setEditing] = React.useState(null);
  const [snack, setSnack] = React.useState(false);
  const [displayMode, setDisplayMode] = React.useState('code');
  const { busy, seconds, perform } = useProcessing();

  const load = async (progId) => {
    const data = await trazabilidadGRApi.get(progId);
    setPrincipiosGR(data.principiosGR);
    setObjetivosGR(data.objetivosGR);
    const map = {};
    (data.relaciones || []).forEach((r) => {
      map[`${r.principioGR_id}-${r.objetivoGR_id}`] = r.nivel;
    });
    setRelaciones(map);
  };

  const formatLabel = (item) =>
    displayMode === 'codeTitle' ? `${item.codigo} - ${item.titulo}` : item.codigo;

  const tooltipContent = (titulo, descripcion) => (
    <React.Fragment>
      <Typography fontWeight="bold">{titulo}</Typography>
      {descripcion && (
        <Typography sx={{ whiteSpace: 'pre-line' }}>{descripcion}</Typography>
      )}
    </React.Fragment>
  );

  const handleProgramChange = (val) => {
    setPrograma(val);
    if (val) load(val.id);
  };

  const handleCellClick = (objGRId, prinGRId) => {
    if (busy) return;
    const key = `${prinGRId}-${objGRId}`;
    const value = relaciones[key] != null ? relaciones[key] : 0;
    setEditing({ objGRId, prinGRId, value });
  };

  const handleLevelChange = async (value) => {
    const { objGRId, prinGRId } = editing;
    await perform(async () => {
      await trazabilidadGRApi.save({
        programaId: programa.id,
        objetivoGRId: objGRId,
        principioGRId: prinGRId,
        nivel: value,
      });
      await load(programa.id);
      setSnack(true);
    });
    setEditing(null);
  };

  const renderCell = (objGRId, prinGRId) => {
    const key = `${prinGRId}-${objGRId}`;
    const nivel = relaciones[key];
    if (editing && editing.objGRId === objGRId && editing.prinGRId === prinGRId) {
      return (
        <Select
          value={editing.value}
          open
          onChange={(e) => handleLevelChange(parseInt(e.target.value, 10))}
          onClose={() => setEditing(null)}
          disabled={busy}
          autoWidth
        >
          <MenuItem value={0}>N/A</MenuItem>
          <MenuItem value={1}>Baja</MenuItem>
          <MenuItem value={2}>Media</MenuItem>
          <MenuItem value={3}>Alta</MenuItem>
        </Select>
      );
    }
    if (nivel == null) {
      return (
        <span className="material-symbols-outlined" style={{ color: 'red' }}>
          block
        </span>
      );
    }
    if (nivel === 0) return 'N/A';
    const colors = ['#a5d6a7', '#66bb6a', '#2e7d32'];
    return (
      <span>
        {Array.from({ length: nivel }).map((_, i) => (
          <span
            key={i}
            className="material-symbols-outlined"
            style={{ color: colors[i] }}
          >
            fiber_manual_record
          </span>
        ))}
      </span>
    );
  };

  const exportCSV = () => {
    if (!programa) return;
    const headers = ['Objetivo \\ Principio', ...principiosGR.map((p) => p.codigo)];
    const rows = objetivosGR.map((o) => {
      const row = [o.codigo];
      principiosGR.forEach((p) => {
        const key = `${p.id}-${o.id}`;
        const nivel = relaciones[key];
        if (nivel == null) row.push('Sin relación');
        else if (nivel === 0) row.push('N/A');
        else if (nivel === 1) row.push('Baja');
        else if (nivel === 2) row.push('Media');
        else row.push('Alta');
      });
      return row;
    });
    exportToCSV(headers, rows, 'TrazabilidadPrincipiosGRObjetivosGR');
  };

  const exportPDF = () => {
    if (!programa) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Trazabilidad principios GR vs objetivos GR', 10, 10);
    let y = 20;
    const header = ['Objetivo', ...principiosGR.map((p) => p.codigo)].join(' | ');
    doc.text(header, 10, y);
    y += 10;
    objetivosGR.forEach((o) => {
      const vals = [o.codigo];
      principiosGR.forEach((p) => {
        const key = `${p.id}-${o.id}`;
        const nivel = relaciones[key];
        if (nivel == null) vals.push('Sin relación');
        else if (nivel === 0) vals.push('N/A');
        else if (nivel === 1) vals.push('Baja');
        else if (nivel === 2) vals.push('Media');
        else vals.push('Alta');
      });
      doc.text(vals.join(' | '), 10, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save(`${formatDate()} TrazabilidadPrincipiosGRObjetivosGR.pdf`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Trazabilidad principios GR vs objetivos GR
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Autocomplete
          options={programasGuardarrail}
          getOptionLabel={(p) => p.nombre}
          value={programa}
          onChange={(e, val) => handleProgramChange(val)}
          renderInput={(params) => (
            <TextField {...params} label="Programa guardarrail*" />
          )}
          sx={{ minWidth: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="display-mode-label">Formato</InputLabel>
          <Select
            labelId="display-mode-label"
            value={displayMode}
            label="Formato"
            onChange={(e) => setDisplayMode(e.target.value)}
          >
            <MenuItem value="code">Solo códigos</MenuItem>
            <MenuItem value="codeTitle">Código y título</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Exportar CSV">
          <span>
            <IconButton onClick={exportCSV} disabled={!programa || busy}>
              <span className="material-symbols-outlined">download</span>
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Exportar PDF">
          <span>
            <IconButton onClick={exportPDF} disabled={!programa || busy}>
              <span className="material-symbols-outlined">picture_as_pdf</span>
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      {programa && (
        <Table>
          <TableHead sx={tableHeadSx}>
            <TableRow>
              <TableCell>Objetivo \\ Principio</TableCell>
              {principiosGR.map((p) => (
                <TableCell key={p.id}>
                  <Tooltip title={tooltipContent(p.titulo, p.descripcion)}>
                    <span>{formatLabel(p)}</span>
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {objetivosGR.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <Tooltip title={tooltipContent(o.titulo, o.descripcion)}>
                    <span>{formatLabel(o)}</span>
                  </Tooltip>
                </TableCell>
                {principiosGR.map((p) => (
                  <TableCell
                    key={p.id}
                    onClick={() => handleCellClick(o.id, p.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {renderCell(o.id, p.id)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <ProcessingBanner seconds={seconds} />
      <Snackbar
        open={snack}
        autoHideDuration={3000}
        onClose={() => setSnack(false)}
        message="Nivel actualizado"
      />
    </Box>
  );
}
