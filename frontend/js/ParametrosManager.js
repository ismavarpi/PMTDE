function ParametrosManager({ parametros, setParametros, setAppName }) {
  React.useEffect(() => {
    if (!parametros.length) {
      parametrosApi.list().then(setParametros);
    }
  }, []);

  const updateLocal = (id, valor) => {
    setParametros(parametros.map((p) => (p.id === id ? { ...p, valor } : p)));
  };

  const save = async (param) => {
    const updated = await parametrosApi.save(param);
    setParametros(parametros.map((p) => (p.id === param.id ? updated : p)));
    if (updated.nombre === 'Nombre de la aplicación') {
      setAppName(updated.valor);
    }
  };

  const reset = async (param) => {
    const updated = await parametrosApi.reset(param.id);
    setParametros(parametros.map((p) => (p.id === param.id ? updated : p)));
    if (updated.nombre === 'Nombre de la aplicación') {
      setAppName(updated.valor);
    }
  };

  return (
    <List>
      {parametros.map((p) => (
        <ListItem key={p.id} sx={{ gap: 1 }}>
          <ListItemText
            primary={p.nombre}
            secondary={`Por defecto: ${p.valor_defecto}`}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            value={p.valor}
            onChange={(e) => updateLocal(p.id, e.target.value)}
          />
          <Button variant="contained" onClick={() => save(p)}>
            Guardar
          </Button>
          <Button variant="outlined" onClick={() => reset(p)}>
            Restablecer
          </Button>
        </ListItem>
      ))}
    </List>
  );
}
