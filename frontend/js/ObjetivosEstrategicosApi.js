const objetivosEstrategicosApi = {
  list: async () => {
    const res = await fetch('/api/objetivosEstrategicos');
    return res.json();
  },
  save: async (record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id
      ? `/api/objetivosEstrategicos/${record.id}`
      : '/api/objetivosEstrategicos';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error('Error al guardar objetivo estratégico');
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/objetivosEstrategicos/${id}?confirm=true`, { method: 'DELETE' });
  },
};
