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
  remove: async (id, confirm = false) => {
    const url = `/api/objetivosGuardarrail/${id}` + (confirm ? '?confirm=true' : '');
    const res = await fetch(url, { method: 'DELETE' });
    if (res.status === 400) {
      const data = await res.json();
      return { status: res.status, ...data };
    }
    return { status: res.status };
  },
};
