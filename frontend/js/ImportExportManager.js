function ImportExportManager() {
  const [sqlText, setSqlText] = React.useState('');
  const [entities, setEntities] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [summary, setSummary] = React.useState([]);
  const [logs, setLogs] = React.useState('');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const text = await file.text();
      setSqlText(text);
      const found = Array.from(
        new Set(
          [...text.matchAll(/INSERT INTO `?(\w+)`?/g)].map((m) => m[1])
        )
      );
      setEntities(found);
      setSelected(found);
    }
  };

  const toggle = (ent) => {
    setSelected((prev) =>
      prev.includes(ent) ? prev.filter((e) => e !== ent) : [...prev, ent]
    );
  };

  const doImport = async () => {
    const result = await importExportApi.importData(sqlText, selected);
    setSummary(result.summary || []);
    setLogs(result.logs || '');
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Importación y exportación</Typography>
      <Typography variant="h6">Exportación de datos</Typography>
      <Button variant="contained" onClick={() => importExportApi.exportData()}>
        Exportar datos
      </Button>

      <Typography variant="h6" sx={{ mt: 4 }}>
        Importación de datos
      </Typography>
      <Button variant="contained" component="label">
        Seleccionar archivo de datos
        <input hidden type="file" onChange={handleFile} />
      </Button>

      {entities.length > 0 && (
        <Box>
          <Typography>Entidades:</Typography>
          {entities.map((ent) => (
            <FormControlLabel
              key={ent}
              control={
                <Checkbox
                  checked={selected.includes(ent)}
                  onChange={() => toggle(ent)}
                />
              }
              label={ent}
            />
          ))}
          <Button variant="contained" onClick={doImport} sx={{ mt: 2 }}>
            Importar datos
          </Button>
        </Box>
      )}

      {summary.length > 0 && (
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Entidad</TableCell>
                <TableCell>Correctos</TableCell>
                <TableCell>Errores</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.map((s) => (
                <TableRow key={s.entity}>
                  <TableCell>{s.entity}</TableCell>
                  <TableCell>{s.ok}</TableCell>
                  <TableCell>{s.errors}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Logs
          </Typography>
          <Box sx={{ whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{ __html: marked.parse(logs || '') }} />
        </Box>
      )}
    </Box>
  );
}
