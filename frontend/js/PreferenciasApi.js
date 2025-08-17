const preferenciasApi = {
  get: async (tabla) => {
    const res = await fetch(`/api/preferencias/${tabla}`);
    return res.json();
  },
  save: async (tabla, columns) => {
    await fetch('/api/preferencias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tabla, columns }),
    });
  },
};
