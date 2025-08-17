const ProcessingBanner = ({ seconds }) => {
  if (!seconds) return null;
  return (
    <Box sx={{ position: 'fixed', top: 0, width: '100%', textAlign: 'center', bgcolor: 'warning.main', p: 1 }}>
      {`Procesando... ${seconds} seg`}
    </Box>
  );
};
