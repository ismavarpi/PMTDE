const programasGuardarrailApi = {
  list: async () => {
    const res = await fetch('/api/programasGuardarrail');
    return res.json();
  },
  save: async (record) => {
    const payload = { ...record, codigo: (record.codigo || '').toUpperCase().slice(0, 8) };
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id ? `/api/programasGuardarrail/${record.id}` : '/api/programasGuardarrail';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  remove: async (id, confirm = false) => {
    const url = `/api/programasGuardarrail/${id}` + (confirm ? '?confirm=true' : '');
    const res = await fetch(url, { method: 'DELETE' });
    if (res.status === 400) {
      const data = await res.json();
      return { status: res.status, ...data };
    }
    return { status: res.status };
  },
};
