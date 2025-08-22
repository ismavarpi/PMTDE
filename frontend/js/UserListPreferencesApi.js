const userListPreferencesApi = {
  get: async (listId) => {
    const res = await fetch(`/api/user-list-preferences/${listId}`);
    return res.json();
  },
  save: async (listId, columns) => {
    await fetch('/api/user-list-preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listId, columns }),
    });
  },
};
