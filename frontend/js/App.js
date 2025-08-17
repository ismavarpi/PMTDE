const drawerWidth = 250;

function App() {
  const [view, setView] = React.useState('home');
  const [usuarios, setUsuarios] = React.useState([]);
  const [pmtde, setPmtde] = React.useState([]);
  const [programasGuardarrail, setProgramasGuardarrail] = React.useState([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [profileAnchor, setProfileAnchor] = React.useState(null);

  const go = (v) => {
    setView(v);
  };

  React.useEffect(() => {
    usuariosApi.list().then(setUsuarios);
    pmtdeApi.list().then(setPmtde);
    programasGuardarrailApi.list().then(setProgramasGuardarrail);
  }, []);

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
          <Tooltip title="Administración">
            <IconButton color="inherit" onClick={() => setView('admin')}>
              <span className="material-symbols-outlined">settings</span>
            </IconButton>
          </Tooltip>
          <Tooltip title="Perfil de usuario">
            <IconButton
              color="inherit"
              onClick={(e) => setProfileAnchor(e.currentTarget)}
            >
              <span className="material-symbols-outlined">account_circle</span>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={() => setProfileAnchor(null)}
          >
            <MenuItem onClick={() => setProfileAnchor(null)}>Perfil</MenuItem>
            <MenuItem onClick={() => setProfileAnchor(null)}>Cerrar sesión</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>


      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{ '& .MuiDrawer-paper': { top: 64, width: drawerWidth, height: 'calc(100% - 64px)' } }}
      >
        <List>
          <ListItemButton onClick={() => go('programasGuardarrail')}>
            <ListItemIcon>
              <span className="material-symbols-outlined">layers</span>
            </ListItemIcon>
            <ListItemText primary="Programas Guardarrail" />
          </ListItemButton>
          <ListItemButton onClick={() => go('planesEstrategicos')}>
            <ListItemIcon>
              <span className="material-symbols-outlined">flag</span>
            </ListItemIcon>
            <ListItemText primary="Planes Estratégicos" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box
        sx={{
          width: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)`,
          marginLeft: drawerOpen ? `${drawerWidth}px` : 0,
          transition: 'margin-left 0.3s, width 0.3s',
        }}
      >
        {view === 'pmtde' && (
          <PmtdeManager usuarios={usuarios} pmtde={pmtde} setPmtde={setPmtde} />
        )}
        {view === 'programasGuardarrail' && (
          <ProgramaGuardarrailManager
            programasGuardarrail={programasGuardarrail}
            setProgramasGuardarrail={setProgramasGuardarrail}
            pmtde={pmtde}
            usuarios={usuarios}
          />
        )}
        {view === 'planesEstrategicos' && <PlanesEstrategicosManager usuarios={usuarios} pmtde={pmtde} />}

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
    </Box>
  );
}
