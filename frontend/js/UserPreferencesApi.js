const userPreferencesApi = {
  get: async () => {
    const res = await fetch('/api/user-preferences');
    return res.json();
  },
  save: async (prefs) => {
    await fetch('/api/user-preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs),
    });
  },
};
