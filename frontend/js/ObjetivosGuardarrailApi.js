const objetivosGuardarrailApi = {
  list: async () => {
    const res = await fetch('/api/objetivosGuardarrail');
    return res.json();
  },
  save: async (record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id
      ? `/api/objetivosGuardarrail/${record.id}`
      : '/api/objetivosGuardarrail';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/objetivosGuardarrail/${id}?confirm=true`, { method: 'DELETE' });
  },
};
