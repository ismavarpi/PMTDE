function AdminPanel({ usuarios, setUsuarios }) {
  return (
    <Box>
      <UsuariosManager usuarios={usuarios} setUsuarios={setUsuarios} />
    </Box>
  );
}
