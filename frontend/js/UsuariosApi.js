const usuariosApi = {
  list: async () => {
    const res = await fetch('/api/usuarios');
    return res.json();
  },
  save: async (record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id ? `/api/usuarios/${record.id}` : '/api/usuarios';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
  },
};
