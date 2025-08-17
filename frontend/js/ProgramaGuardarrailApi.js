const programasGuardarrailApi = {
  list: async () => {
    const res = await fetch('/api/programasGuardarrail');
    return res.json();
  },
  save: async (record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id ? `/api/programasGuardarrail/${record.id}` : '/api/programasGuardarrail';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/programasGuardarrail/${id}`, { method: 'DELETE' });
  },
};
