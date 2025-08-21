const dafoProgramasGuardarrailApi = {
  list: async () => {
    const res = await fetch('/api/dafoProgramasGuardarrail');
    return res.json();
  },
  save: async (record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id
      ? `/api/dafoProgramasGuardarrail/${record.id}`
      : '/api/dafoProgramasGuardarrail';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/dafoProgramasGuardarrail/${id}?confirm=true`, { method: 'DELETE' });
  },
};
