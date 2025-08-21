const drawerWidth = 250;

function App() {
  const [view, setView] = React.useState('home');
  const [usuarios, setUsuarios] = React.useState([]);
  const [pmtde, setPmtde] = React.useState([]);
  const [organizaciones, setOrganizaciones] = React.useState([]);
  const [normativas, setNormativas] = React.useState([]);
  const [programasGuardarrail, setProgramasGuardarrail] = React.useState([]);
  const [principiosGuardarrail, setPrincipiosGuardarrail] = React.useState([]);
  const [parametros, setParametros] = React.useState([]);
  const [appName, setAppName] = React.useState('Aplicación');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [profileAnchor, setProfileAnchor] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [useAuth, setUseAuth] = React.useState(false);
  const [planesMenuOpen, setPlanesMenuOpen] = React.useState(false);
  const [programasMenuOpen, setProgramasMenuOpen] = React.useState(false);
  const [pmtdeMenuOpen, setPmtdeMenuOpen] = React.useState(false);

  const go = (v) => setView(v);

  const loadData = () => {
    usuariosApi.list().then(setUsuarios);
    pmtdeApi.list().then(setPmtde);
    organizacionesApi.list().then(setOrganizaciones);
    normativasApi.list().then(setNormativas);
    programasGuardarrailApi.list().then(setProgramasGuardarrail);
    principiosGuardarrailApi.list().then(setPrincipiosGuardarrail);
    parametrosApi.list().then((params) => {
      setParametros(params);
      const nameParam = params.find((p) => p.nombre === 'Nombre de la aplicación');
      if (nameParam) setAppName(nameParam.valor);
    });
  };

  React.useEffect(() => {
    authApi.me().then(({ user, useAuth }) => {
      setUser(user);
      setUseAuth(useAuth);
      if (!useAuth || user) {
        loadData();
      }
    });
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    loadData();
  };

  const handleLogout = async () => {
    await authApi.logout();
    setUser(null);
    setView('home');
  };

  if (useAuth && !user) {
    return (
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {appName}
            </Typography>
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
              <MenuItem onClick={() => setProfileAnchor(null)}>Login</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Login onLogin={handleLogin} />
      </Box>
    );
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <span className="material-symbols-outlined">
              {drawerOpen ? 'menu_open' : 'menu'}
            </span>
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {appName}
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
            {user && <MenuItem>{user.username}</MenuItem>}
            {user && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          '& .MuiDrawer-paper': {
            top: 64,
            width: drawerWidth,
            height: 'calc(100% - 64px)',
          },
        }}
      >
        <List>
          <Tooltip title="Programa Marco de Transformación Digital Efectiva" placement="right">
            <ListItemButton
              onClick={() => {
                go('pmtde');
                setPmtdeMenuOpen((o) => !o);
              }}
            >
              <ListItemIcon>
                <span className="material-symbols-outlined">dashboard</span>
              </ListItemIcon>
              <ListItemText primary="PMTDE" />
              <span className="material-symbols-outlined">
                {pmtdeMenuOpen ? 'expand_less' : 'expand_more'}
              </span>
            </ListItemButton>
          </Tooltip>
          <Collapse in={pmtdeMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => go('pmtde')}>
                <ListItemIcon>
                  <span className="material-symbols-outlined">dashboard</span>
                </ListItemIcon>
                <ListItemText primary="PMTDE" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => go('organizaciones')}>
                <ListItemIcon>
                  <span className="material-symbols-outlined">business</span>
                </ListItemIcon>
                <ListItemText primary="Organizaciones" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => go('normativas')}>
                <ListItemIcon>
                  <span className="material-symbols-outlined">gavel</span>
                </ListItemIcon>
                <ListItemText primary="Normativas" />
              </ListItemButton>
            </List>
          </Collapse>
          <ListItemButton
            onClick={() => {
              go('programasGuardarrail');
              setProgramasMenuOpen((o) => !o);
            }}
          >
            <ListItemIcon>
              <span className="material-symbols-outlined">layers</span>
            </ListItemIcon>
            <ListItemText primary="Programas Guardarrail" />
            <span className="material-symbols-outlined">
              {programasMenuOpen ? 'expand_less' : 'expand_more'}
            </span>
          </ListItemButton>
          <Collapse in={programasMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => go('programasGuardarrail')}>
                <ListItemIcon>
                  <span className="material-symbols-outlined">layers</span>
                </ListItemIcon>
                <ListItemText primary="Programas" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => go('principiosGuardarrail')}>
                <ListItemIcon>
                  <span className="material-symbols-outlined">rule</span>
                </ListItemIcon>
                <ListItemText primary="Principios Guardarrail" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => go('objetivosGuardarrail')}>
                <ListItemIcon>
                  <span className="material-symbols-outlined">my_location</span>
                </ListItemIcon>
                <ListItemText primary="Objetivos Guardarrail" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => go('trazabilidad')}>
                <ListItemIcon>
                  <span className="material-symbols-outlined">grid_on</span>
                </ListItemIcon>
                <ListItemText primary="Trazabilidad principios GR vs objetivos GR" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton onClick={() => setPlanesMenuOpen((o) => !o)}>
            <ListItemIcon>
              <span className="material-symbols-outlined">flag</span>
            </ListItemIcon>
            <ListItemText primary="Planes Estratégicos" />
            <span className="material-symbols-outlined">
              {planesMenuOpen ? 'expand_less' : 'expand_more'}
            </span>
          </ListItemButton>
          <Collapse in={planesMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => go('planesEstrategicos')}>
                <ListItemIcon>
                  <span className="material-symbols-outlined">flag</span>
                </ListItemIcon>
                <ListItemText primary="Planes" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => go('principiosEspecificos')}>
                <ListItemIcon>
                  <span className="material-symbols-outlined">fact_check</span>
                </ListItemIcon>
                <ListItemText primary="Principios específicos" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => go('objetivosEstrategicos')}>
                <ListItemIcon>
                  <span className="material-symbols-outlined">my_location</span>
                </ListItemIcon>
                <ListItemText primary="Objetivos estratégicos" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => go('dafoPlanesEstrategicos')}>
                <ListItemIcon>
                  <span className="material-symbols-outlined">category</span>
                </ListItemIcon>
                <ListItemText primary="DAFO" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => go('dafoProgramasGuardarrail')}>
                <ListItemIcon>
                  <span className="material-symbols-outlined">category</span>
                </ListItemIcon>
                <ListItemText primary="DAFO programas guardarrail" />
              </ListItemButton>
            </List>
          </Collapse>
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
          <PmtdeManager
            usuarios={usuarios}
            pmtde={pmtde}
            setPmtde={setPmtde}
          />
        )}
        {view === 'organizaciones' && (
          <OrganizacionesManager organizaciones={organizaciones} setOrganizaciones={setOrganizaciones} pmtde={pmtde} />
        )}
        {view === 'normativas' && (
          <NormativasManager normativas={normativas} setNormativas={setNormativas} pmtde={pmtde} organizaciones={organizaciones} />
        )}
        {view === 'programasGuardarrail' && (
          <ProgramaGuardarrailManager
            programasGuardarrail={programasGuardarrail}
            setProgramasGuardarrail={setProgramasGuardarrail}
            pmtde={pmtde}
            usuarios={usuarios}
            refreshPrincipios={() =>
              principiosGuardarrailApi.list().then(setPrincipiosGuardarrail)
            }
          />
        )}
        {view === 'principiosGuardarrail' && (
          <PrincipioGuardarrailManager
            principiosGuardarrail={principiosGuardarrail}
            setPrincipiosGuardarrail={setPrincipiosGuardarrail}
            programasGuardarrail={programasGuardarrail}
          />
        )}
        {view === 'objetivosGuardarrail' && <ObjetivosGuardarrailManager />}
        {view === 'trazabilidad' && (
          <TrazabilidadPrincipioGRObjetivoGRManager programasGuardarrail={programasGuardarrail} />
        )}
        {view === 'planesEstrategicos' && (
          <PlanesEstrategicosManager usuarios={usuarios} pmtde={pmtde} />
        )}
        {view === 'objetivosEstrategicos' && <ObjetivosEstrategicosManager />}
        {view === 'principiosEspecificos' && <PrincipiosEspecificosManager />}
        {view === 'dafoPlanesEstrategicos' && <DafoPlanesEstrategicosManager />}
        {view === 'dafoProgramasGuardarrail' && <DafoProgramasGuardarrailManager />}
        {view === 'admin' && (
          <AdminPanel
            usuarios={usuarios}
            setUsuarios={setUsuarios}
            parametros={parametros}
            setParametros={setParametros}
            setAppName={setAppName}
          />
        )}
        {view === 'home' && <ChangelogManager />}
      </Box>
    </Box>
  );
}

