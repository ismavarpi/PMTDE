const principiosEspecificosApi = {
  list: async () => {
    const res = await fetch('/api/principiosEspecificos');
    return res.json();
  },
  save: async (record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id ? `/api/principiosEspecificos/${record.id}` : '/api/principiosEspecificos';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/principiosEspecificos/${id}?confirm=true`, { method: 'DELETE' });
  },
};
