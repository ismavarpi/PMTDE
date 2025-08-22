const pmtdeApi = {
  list: async () => {
    const res = await fetch('/api/pmtde');
    return res.json();
  },
  getActive: async () => {
    const res = await fetch('/api/pmtde/active');
    return res.json();
  },
  setActive: async (id) => {
    const res = await fetch('/api/pmtde/active', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return res.json();
  },
  save: async (record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id ? `/api/pmtde/${record.id}` : '/api/pmtde';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/pmtde/${id}?confirm=true`, { method: 'DELETE' });
  },
};
