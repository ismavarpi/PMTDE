const normativasApi = {
  list: async () => {
    const res = await fetch('/api/normativas');
    return res.json();
  },
  save: async (record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id ? `/api/normativas/${record.id}` : '/api/normativas';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/normativas/${id}?confirm=true`, { method: 'DELETE' });
  },
};
