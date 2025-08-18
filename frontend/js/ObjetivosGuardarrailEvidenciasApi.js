const objetivosGuardarrailEvidenciasApi = {
  list: async (objetivoId) => {
    const res = await fetch(`/api/objetivosGuardarrailEvidencias?objetivoId=${objetivoId}`);
    return res.json();
  },
  save: async (objetivoId, record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id
      ? `/api/objetivosGuardarrailEvidencias/${record.id}`
      : '/api/objetivosGuardarrailEvidencias';
    const payload = { ...record, objetivo: { id: objetivoId } };
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  remove: async (id) => {
    await fetch(`/api/objetivosGuardarrailEvidencias/${id}?confirm=true`, { method: 'DELETE' });
  },
};
