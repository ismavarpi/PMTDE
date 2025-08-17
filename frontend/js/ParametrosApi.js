const parametrosApi = {
  list: async () => {
    const res = await fetch('/api/parametros');
    return res.json();
  },
  save: async (param) => {
    const res = await fetch(`/api/parametros/${param.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valor: param.valor }),
    });
    return res.json();
  },
  reset: async (id) => {
    const res = await fetch(`/api/parametros/${id}/reset`, { method: 'POST' });
    return res.json();
  },
};
