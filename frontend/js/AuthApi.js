const authApi = {
  me: async () => {
    const res = await fetch('/api/auth/me');
    return res.json();
  },
  login: async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },
  logout: async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
  },
};
