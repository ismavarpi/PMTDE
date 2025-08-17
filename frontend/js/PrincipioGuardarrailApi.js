const principiosGuardarrailApi = {
  list: async () => {
    const res = await fetch('/api/principiosGuardarrail');
    return res.json();
  },
  save: async (record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id
      ? `/api/principiosGuardarrail/${record.id}`
      : '/api/principiosGuardarrail';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/principiosGuardarrail/${id}?confirm=true`, { method: 'DELETE' });
  },
};
