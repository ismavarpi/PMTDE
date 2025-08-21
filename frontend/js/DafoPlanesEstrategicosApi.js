const dafoPlanesEstrategicosApi = {
  list: async () => {
    const res = await fetch('/api/dafoPlanesEstrategicos');
    return res.json();
  },
  save: async (record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id
      ? `/api/dafoPlanesEstrategicos/${record.id}`
      : '/api/dafoPlanesEstrategicos';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/dafoPlanesEstrategicos/${id}?confirm=true`, { method: 'DELETE' });
  },
};
