function AdminPanel({ usuarios, setUsuarios }) {
  const [tab, setTab] = React.useState(0);
  return (
    <Box>
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="Programas Marco" />
        <Tab label="Usuarios" />
      </Tabs>
      {tab === 0 && <ProgramasManager usuarios={usuarios} />}
      {tab === 1 && <UsuariosManager usuarios={usuarios} setUsuarios={setUsuarios} />}
    </Box>
  );
}
