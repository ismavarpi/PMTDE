function AdminPanel({ usuarios, setUsuarios, parametros, setParametros, setAppName }) {
  const [tab, setTab] = React.useState(0);
  return (
    <Box>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Usuarios" />
        <Tab label="Parámetros" />
        <Tab label="Importación / Exportación" />
      </Tabs>
      {tab === 0 && <UsuariosManager usuarios={usuarios} setUsuarios={setUsuarios} />}
      {tab === 1 && (
        <ParametrosManager
          parametros={parametros}
          setParametros={setParametros}
          setAppName={setAppName}
        />
      )}
      {tab === 2 && <ImportExportManager />}
    </Box>
  );
}
