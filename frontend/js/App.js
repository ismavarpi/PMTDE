function App() {
  const [view, setView] = React.useState('home');
  const [usuarios, setUsuarios] = React.useState([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const go = (v) => {
    setView(v);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(!drawerOpen)}>
            <span className="material-symbols-outlined">
              {drawerOpen ? 'menu_open' : 'menu'}
            </span>
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            PMTDE
          </Typography>
          <IconButton color="inherit" onClick={() => setView('admin')}>
            <span className="material-symbols-outlined">settings</span>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{ '& .MuiDrawer-paper': { top: 64, width: 250, height: 'calc(100% - 64px)' } }}
      >
        <List>
          <ListItemButton onClick={() => go('programas')}>
            <ListItemIcon>
              <span className="material-symbols-outlined">layers</span>
            </ListItemIcon>
            <ListItemText primary="Programas Guardarrailes" />
          </ListItemButton>
          <ListItemButton onClick={() => go('planes')}>
            <ListItemIcon>
              <span className="material-symbols-outlined">flag</span>
            </ListItemIcon>
            <ListItemText primary="Planes Estratégicos" />
          </ListItemButton>
        </List>
      </Drawer>

      {view === 'programas' && <ProgramasManager usuarios={usuarios} />}
      {view === 'planes' && <PlanesManager usuarios={usuarios} />}
      {view === 'admin' && <AdminPanel usuarios={usuarios} setUsuarios={setUsuarios} />}
      {view === 'home' && <Box sx={{ p: 2 }}>Bienvenido</Box>}
    </Box>
  );
}
