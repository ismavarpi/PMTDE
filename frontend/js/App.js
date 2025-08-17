function App() {
  const [view, setView] = React.useState('home');
  const [usuarios, setUsuarios] = React.useState([]);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            PMTDE
          </Typography>
          <IconButton color="inherit" onClick={() => setView('admin')}>
            <span className="material-symbols-outlined">settings</span>
          </IconButton>
        </Toolbar>
      </AppBar>
      {view === 'admin' ? (
        <AdminPanel usuarios={usuarios} setUsuarios={setUsuarios} />
      ) : (
        <Box sx={{ p: 2 }}>Bienvenido</Box>
      )}
    </Box>
  );
}
