function ListActions({ onCreate, onToggleFilter, onOpenColumns, view, onToggleView, onExportCSV, onExportPDF, busy, sx }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 1, ...(sx || {}) }}>
      <Tooltip title="Añadir">
        <IconButton onClick={onCreate} disabled={busy}>
          <span className="material-symbols-outlined">add</span>
        </IconButton>
      </Tooltip>
      <Tooltip title="Filtrar">
        <IconButton onClick={onToggleFilter} disabled={busy}>
          <span className="material-symbols-outlined">filter_list</span>
        </IconButton>
      </Tooltip>
      <Tooltip title="Seleccionar columnas">
        <IconButton onClick={onOpenColumns} disabled={busy}>
          <span className="material-symbols-outlined">view_column</span>
        </IconButton>
      </Tooltip>
      <Tooltip title={view === 'table' ? 'Ver como cards' : 'Ver como tabla'}>
        <IconButton onClick={onToggleView} disabled={busy}>
          <span className="material-symbols-outlined">{view === 'table' ? 'dashboard' : 'table_rows'}</span>
        </IconButton>
      </Tooltip>
      <Tooltip title="Exportar CSV">
        <IconButton onClick={onExportCSV} disabled={busy}>
          <span className="material-symbols-outlined">download</span>
        </IconButton>
      </Tooltip>
      <Tooltip title="Exportar PDF">
        <IconButton onClick={onExportPDF} disabled={busy}>
          <span className="material-symbols-outlined">picture_as_pdf</span>
        </IconButton>
      </Tooltip>
    </Box>
  );
}
