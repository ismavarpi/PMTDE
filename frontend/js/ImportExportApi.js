const importExportApi = {
  exportData: () => {
    window.location = '/api/import-export/export';
  },
  importData: async (sql, tables) => {
    const res = await fetch('/api/import-export/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, tables }),
    });
    return res.json();
  },
};
