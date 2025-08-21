const organizacionesApi = {
  list: async () => {
    const res = await fetch('/api/organizaciones');
    return res.json();
  },
  save: async (record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id ? `/api/organizaciones/${record.id}` : '/api/organizaciones';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/organizaciones/${id}?confirm=true`, { method: 'DELETE' });
  },
};
