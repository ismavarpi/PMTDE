function TrazabilidadInputsObjetivosManager() {
  const [plan, setPlan] = React.useState(null);
  const [planes, setPlanes] = React.useState([]);
  const [inputs, setInputs] = React.useState([]);
  const [objetivos, setObjetivos] = React.useState([]);
  const [relaciones, setRelaciones] = React.useState({});
  const [editing, setEditing] = React.useState(null);
  const [snack, setSnack] = React.useState(false);
  const [displayMode, setDisplayMode] = React.useState('code');
  const { busy, seconds, perform } = useProcessing();

  React.useEffect(() => {
    planesEstrategicosApi.list().then(setPlanes);
  }, []);

  const load = async (planId) => {
    const data = await trazabilidadInputsObjetivosApi.get(planId);
    setInputs(data.inputs);
    setObjetivos(data.objetivos);
    const map = {};
    (data.relaciones || []).forEach((r) => {
      map[`${r.input_id}-${r.objetivoE_id}`] = r.nivel;
    });
    setRelaciones(map);
  };

  const formatLabel = (item) =>
    displayMode === 'codeTitle' ? `${item.codigo} - ${item.titulo}` : item.codigo;

  const tooltipContent = (codigo, titulo, descripcion) => (
    <React.Fragment>
      <Typography fontWeight="bold">{`${codigo} - ${titulo}`}</Typography>
      {descripcion && (
        <Typography sx={{ whiteSpace: 'pre-line' }}>{descripcion}</Typography>
      )}
    </React.Fragment>
  );

  const handlePlanChange = (val) => {
    setPlan(val);
    if (val) load(val.id);
  };

  const handleCellClick = (objId, inputId) => {
    if (busy) return;
    const key = `${inputId}-${objId}`;
    const value = relaciones[key] != null ? relaciones[key] : 0;
    setEditing({ objId, inputId, value });
  };

  const handleLevelChange = async (value) => {
    const { objId, inputId } = editing;
    await perform(async () => {
      await trazabilidadInputsObjetivosApi.save({
        planId: plan.id,
        inputId,
        objetivoEId: objId,
        nivel: value,
      });
      await load(plan.id);
      setSnack(true);
    });
    setEditing(null);
  };

  const renderCell = (objId, inputId) => {
    const key = `${inputId}-${objId}`;
    const nivel = relaciones[key];
    if (editing && editing.objId === objId && editing.inputId === inputId) {
      return (
        <Select
          value={editing.value}
          open
          onChange={(e) => handleLevelChange(parseInt(e.target.value, 10))}
          onClose={() => setEditing(null)}
          disabled={busy}
          autoWidth
        >
          <MenuItem value={0}>Sin relación</MenuItem>
          <MenuItem value={1}>Baja</MenuItem>
          <MenuItem value={2}>Media</MenuItem>
          <MenuItem value={3}>Alta</MenuItem>
          <MenuItem value={4}>N/A</MenuItem>
        </Select>
      );
    }
    if (nivel == null || nivel === 0) return '-';
    if (nivel === 4) return 'N/A';
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
    if (!plan) return;
    const headers = ['Objetivo \\ Input', ...inputs.map((i) => i.codigo)];
    const rows = objetivos.map((o) => {
      const row = [o.codigo];
      inputs.forEach((i) => {
        const key = `${i.id}-${o.id}`;
        const nivel = relaciones[key];
        if (nivel == null || nivel === 0) row.push('Sin relación');
        else if (nivel === 1) row.push('Baja');
        else if (nivel === 2) row.push('Media');
        else if (nivel === 3) row.push('Alta');
        else row.push('N/A');
      });
      return row;
    });
    exportToCSV(headers, rows, 'TrazabilidadInputsObjetivos');
  };

  const exportPDF = () => {
    if (!plan) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Trazabilidad inputs vs objetivos estratégicos', 10, 10);
    let y = 20;
    const header = ['Objetivo', ...inputs.map((i) => i.codigo)].join(' | ');
    doc.text(header, 10, y);
    y += 10;
    objetivos.forEach((o) => {
      const vals = [o.codigo];
      inputs.forEach((i) => {
        const key = `${i.id}-${o.id}`;
        const nivel = relaciones[key];
        if (nivel == null || nivel === 0) vals.push('Sin relación');
        else if (nivel === 1) vals.push('Baja');
        else if (nivel === 2) vals.push('Media');
        else if (nivel === 3) vals.push('Alta');
        else vals.push('N/A');
      });
      doc.text(vals.join(' | '), 10, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save(`${formatDate()} TrazabilidadInputsObjetivos.pdf`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Trazabilidad inputs vs objetivos estratégicos
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Autocomplete
          options={planes}
          getOptionLabel={(p) => p.nombre}
          value={plan}
          onChange={(e, val) => handlePlanChange(val)}
          renderInput={(params) => <TextField {...params} label="Plan estratégico*" />}
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
            <IconButton onClick={exportCSV} disabled={!plan || busy}>
              <span className="material-symbols-outlined">download</span>
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Exportar PDF">
          <span>
            <IconButton onClick={exportPDF} disabled={!plan || busy}>
              <span className="material-symbols-outlined">picture_as_pdf</span>
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      {plan && (
        <Table>
          <TableHead sx={tableHeadSx}>
            <TableRow>
              <TableCell>Objetivo \\ Input</TableCell>
              {inputs.map((i) => (
                <TableCell key={i.id}>
                  <Tooltip title={tooltipContent(i.codigo, i.titulo, i.descripcion)}>
                    <span>{formatLabel(i)}</span>
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {objetivos.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <Tooltip title={tooltipContent(o.codigo, o.titulo, o.descripcion)}>
                    <span>{formatLabel(o)}</span>
                  </Tooltip>
                </TableCell>
                {inputs.map((i) => (
                  <TableCell
                    key={i.id}
                    onClick={() => handleCellClick(o.id, i.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {renderCell(o.id, i.id)}
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
