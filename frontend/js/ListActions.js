function ListActions({ onCreate, onToggleFilter, onOpenColumns, view, onToggleView, onExportCSV, onExportPDF, busy, sx }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 1, ...(sx || {}) }}>
      <Tooltip title="Añadir">
        <span>
          <IconButton onClick={onCreate} disabled={busy}>
            <span className="material-symbols-outlined">add</span>
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Filtrar">
        <span>
          <IconButton onClick={onToggleFilter} disabled={busy}>
            <span className="material-symbols-outlined">filter_list</span>
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Seleccionar columnas">
        <span>
          <IconButton onClick={onOpenColumns} disabled={busy}>
            <span className="material-symbols-outlined">view_column</span>
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={view === 'table' ? 'Ver como cards' : 'Ver como tabla'}>
        <span>
          <IconButton onClick={onToggleView} disabled={busy}>
            <span className="material-symbols-outlined">{view === 'table' ? 'dashboard' : 'table_rows'}</span>
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Exportar CSV">
        <span>
          <IconButton onClick={onExportCSV} disabled={busy}>
            <span className="material-symbols-outlined">download</span>
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Exportar PDF">
        <span>
          <IconButton onClick={onExportPDF} disabled={busy}>
            <span className="material-symbols-outlined">picture_as_pdf</span>
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}
