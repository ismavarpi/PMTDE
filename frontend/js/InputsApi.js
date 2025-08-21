const inputsApi = {
  list: async () => {
    const res = await fetch('/api/inputs');
    return res.json();
  },
  save: async (record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id ? `/api/inputs/${record.id}` : '/api/inputs';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/inputs/${id}?confirm=true`, { method: 'DELETE' });
  },
};
