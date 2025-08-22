function UserPreferencesDialog({ open, onClose, density, onSave }) {
  const [localDensity, setLocalDensity] = React.useState(density || 'Extendido');

  React.useEffect(() => setLocalDensity(density || 'Extendido'), [density]);

  const handleSave = () => {
    onSave(localDensity);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { minWidth: '300px' } }}>
      <DialogTitle>Preferencias</DialogTitle>
      <DialogContent>
        <FormControl fullWidth required>
          <InputLabel>Densidad</InputLabel>
          <Select value={localDensity} label="Densidad" onChange={(e) => setLocalDensity(e.target.value)}>
            <MenuItem value="Compacto">Compacto</MenuItem>
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="Extendido">Extendido</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
