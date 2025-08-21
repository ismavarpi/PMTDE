const trazabilidadGRApi = {
  get: async (programaId) => {
    const res = await fetch(`/api/trazabilidad/${programaId}`);
    return res.json();
  },
  save: async ({ programaId, principioGRId, objetivoGRId, nivel }) => {
    const res = await fetch('/api/trazabilidad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ programaId, principioGRId, objetivoGRId, nivel }),
    });
    return res.json();
  },
};
