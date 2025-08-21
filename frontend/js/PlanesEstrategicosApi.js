const planesEstrategicosApi = {
  list: async () => {
    const res = await fetch('/api/planesEstrategicos');
    return res.json();
  },
  save: async (record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id ? `/api/planesEstrategicos/${record.id}` : '/api/planesEstrategicos';
    const payload = {
      ...record,
      codigo: (record.codigo || '').toUpperCase().substring(0, 8),
    };
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  remove: async (id, confirm = false) => {
    const url = `/api/planesEstrategicos/${id}` + (confirm ? '?confirm=true' : '');
    const res = await fetch(url, { method: 'DELETE' });
    if (res.status === 400) {
      const data = await res.json();
      return { status: res.status, ...data };
    }
    return { status: res.status };
  },
};
