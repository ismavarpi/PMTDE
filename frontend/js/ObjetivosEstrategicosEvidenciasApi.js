const objetivosEstrategicosEvidenciasApi = {
  list: async (objetivoId) => {
    const res = await fetch(
      `/api/objetivosEstrategicosEvidencias?objetivoId=${objetivoId}`
    );
    return res.json();
  },
  save: async (objetivoId, record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id
      ? `/api/objetivosEstrategicosEvidencias/${record.id}`
      : '/api/objetivosEstrategicosEvidencias';
    const payload = { ...record, objetivo: { id: objetivoId } };
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/objetivosEstrategicosEvidencias/${id}?confirm=true`, {
      method: 'DELETE',
    });
  },
};
