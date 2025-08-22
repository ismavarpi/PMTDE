const trazabilidadInputsObjetivosApi = {
  get: async (planId) => {
    const res = await fetch(`/api/trazabilidadInputsObjetivos/${planId}`);
    return res.json();
  },
  save: async ({ planId, inputId, objetivoEId, nivel }) => {
    const res = await fetch('/api/trazabilidadInputsObjetivos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, inputId, objetivoEId, nivel }),
    });
    return res.json();
  },
};
