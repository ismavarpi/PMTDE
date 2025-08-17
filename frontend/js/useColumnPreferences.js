function ColumnSelector({ open, onClose, columns, onSave }) {
  const [localCols, setLocalCols] = React.useState(columns);

  React.useEffect(() => setLocalCols(columns), [columns]);

  const toggle = (key) => {
    setLocalCols(
      localCols.map((c) => (c.key === key ? { ...c, visible: c.visible === false ? true : false } : c))
    );
  };

  const onDragStart = (idx) => (e) => {
    e.dataTransfer.setData('text/plain', idx);
  };
  const onDrop = (idx) => (e) => {
    const from = Number(e.dataTransfer.getData('text/plain'));
    if (Number.isNaN(from)) return;
    const arr = [...localCols];
    const [moved] = arr.splice(from, 1);
    arr.splice(idx, 0, moved);
    setLocalCols(arr);
  };

  const save = () => {
    onSave(localCols);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { minWidth: '300px' } }}>
      <DialogTitle>Seleccionar columnas</DialogTitle>
      <DialogContent>
        <List>
          {localCols.map((c, i) => (
            <ListItem
              key={c.key}
              draggable
              onDragStart={onDragStart(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop(i)}
            >
              <Checkbox checked={c.visible !== false} onChange={() => toggle(c.key)} />
              <ListItemText primary={c.label} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={save}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}

function useColumnPreferences(tabla, defaultColumns) {
  const [columns, setColumns] = React.useState(defaultColumns);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    preferenciasApi.get(tabla).then((saved) => {
      if (Array.isArray(saved)) {
        const map = new Map(defaultColumns.map((c) => [c.key, c]));
        const ordered = [];
        saved.forEach((s) => {
          if (map.has(s.key)) {
            ordered.push({ ...map.get(s.key), visible: s.visible !== false });
            map.delete(s.key);
          }
        });
        map.forEach((c) => ordered.push(c));
        setColumns(ordered);
      }
    });
  }, [tabla]);

  const handleSave = async (cols) => {
    setColumns(cols);
    await preferenciasApi.save(tabla, cols.map((c) => ({ key: c.key, visible: c.visible !== false })));
  };

  const selector = (
    <ColumnSelector open={open} onClose={() => setOpen(false)} columns={columns} onSave={handleSave} />
  );

  return { columns: columns.filter((c) => c.visible !== false), openSelector: () => setOpen(true), selector };
}
