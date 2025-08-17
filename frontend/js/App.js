function App() {
  const [view, setView] = React.useState('home');
  const [usuarios, setUsuarios] = React.useState([]);
  const [pmtde, setPmtde] = React.useState([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const go = (v) => {
    setView(v);
    setDrawerOpen(false);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
            <span className="material-symbols-outlined">menu</span>
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            PMTDE
          </Typography>
          <IconButton color="inherit" onClick={() => setView('admin')}>
            <span className="material-symbols-outlined">settings</span>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItemButton onClick={() => go('pmtde')}>
              <ListItemIcon>
                <span className="material-symbols-outlined">layers</span>
              </ListItemIcon>
              <ListItemText primary="PMTDE" />
            </ListItemButton>
            <ListItemButton onClick={() => go('planes')}>
              <ListItemIcon>
                <span className="material-symbols-outlined">flag</span>
              </ListItemIcon>
              <ListItemText primary="Planes Estratégicos" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {view === 'pmtde' && (
        <PmtdeManager usuarios={usuarios} pmtde={pmtde} setPmtde={setPmtde} />
      )}
      {view === 'planes' && <PlanesManager usuarios={usuarios} />}
      {view === 'admin' && (
        <AdminPanel
          usuarios={usuarios}
          setUsuarios={setUsuarios}
          pmtde={pmtde}
          setPmtde={setPmtde}
        />
      )}
      {view === 'home' && <Box sx={{ p: 2 }}>Bienvenido</Box>}
    </Box>
  );
}
