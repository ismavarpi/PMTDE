let token = localStorage.getItem('token');
const originalFetch = window.fetch.bind(window);
window.fetch = (url, options = {}) => {
  options.headers = options.headers || {};
  if (token) options.headers['Authorization'] = token;
  return originalFetch(url, options)
    .then((res) => {
      if (res.status === 401) {
        token = null;
        localStorage.removeItem('token');
        if (!url.includes('/api/auth/me')) {
          window.location.href = '/';
        }
      }
      return res;
    })
    .catch((err) => {
      console.error('Fetch error:', err);
      throw err;
    });
};

const authApi = {
  me: async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.status === 401) return { user: null, useAuth: true };
      if (!res.ok) return { user: null, useAuth: false };
      return res.json();
    } catch {
      return { user: null, useAuth: false };
    }
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
