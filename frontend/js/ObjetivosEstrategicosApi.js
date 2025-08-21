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
  remove: async (id, confirm = false) => {
    const url = `/api/objetivosEstrategicos/${id}` + (confirm ? '?confirm=true' : '');
    const res = await fetch(url, { method: 'DELETE' });
    if (res.status === 400) {
      const data = await res.json();
      return { status: res.status, ...data };
    }
    return { status: res.status };
  },
};
