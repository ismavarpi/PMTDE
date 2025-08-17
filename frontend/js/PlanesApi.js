const planesApi = {
  list: async () => {
    const res = await fetch('/api/planes');
    return res.json();
  },
  save: async (record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id ? `/api/planes/${record.id}` : '/api/planes';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/planes/${id}`, { method: 'DELETE' });
  },
};
