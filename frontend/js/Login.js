function Login({ onLogin }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  React.useEffect(() => {
    const ssoToken = localStorage.getItem('ssoToken');
    if (ssoToken) {
      authApi.login(null, null, ssoToken).then((res) => {
        if (res.user) {
          onLogin(res.user);
        }
      });
    }
  }, []);
  const submit = async () => {
    const res = await authApi.login(username, password);
    if (res.user) {
      onLogin(res.user);
    } else {
      alert('Credenciales inválidas');
    }
  };
  return (
    <Box sx={{ p: 2, maxWidth: 400, margin: '0 auto' }}>
      <TextField fullWidth margin="normal" label="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
      <TextField fullWidth margin="normal" type="password" label="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" onClick={submit} fullWidth>
        Login
      </Button>
    </Box>
  );
}
