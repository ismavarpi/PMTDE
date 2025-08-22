let token = localStorage.getItem('token');
const originalFetch = window.fetch.bind(window);
window.fetch = (url, options = {}) => {
  options.headers = options.headers || {};
  if (token) options.headers['Authorization'] = token;
  return originalFetch(url, options).then((res) => {
    if (res.status === 401) {
      token = null;
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return res;
  });
};

const authApi = {
  me: async () => {
    const res = await fetch('/api/auth/me');
    return res.json();
  },
  login: async (username, password, ssoToken) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, ssoToken }),
    });
    const data = await res.json();
    if (data.token) {
      token = data.token;
      localStorage.setItem('token', token);
    }
    return data;
  },
  logout: async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('ssoToken');
  },
};
