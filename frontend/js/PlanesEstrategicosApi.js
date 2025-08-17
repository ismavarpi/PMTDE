const planesEstrategicosApi = {
  list: async () => {
    const res = await fetch('/api/planesEstrategicos');
    return res.json();
  },
  save: async (record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id ? `/api/planesEstrategicos/${record.id}` : '/api/planesEstrategicos';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/planesEstrategicos/${id}`, { method: 'DELETE' });
  },
};
