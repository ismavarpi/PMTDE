const { TextField, IconButton, Box, Stack } = MaterialUI;

const MarkdownTextField = ({ label, value, onChange, minRows = 3 }) => {
  const ref = React.useRef();
  const apply = (prefix, suffix = '') => {
    const textarea = ref.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const newVal = value.substring(0, start) + prefix + selected + suffix + value.substring(end);
    onChange({ target: { value: newVal } });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    });
  };

  const buttons = [
    { icon: 'format_bold', fn: () => apply('**', '**') },
    { icon: 'format_italic', fn: () => apply('*', '*') },
    { icon: 'title', fn: () => apply('# ') },
    { icon: 'format_list_bulleted', fn: () => apply('- ') },
    { icon: 'link', fn: () => apply('[', '](url)') },
  ];

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        {buttons.map((b) => (
          <IconButton key={b.icon} onClick={b.fn} size="small">
            <span className="material-symbols-outlined">{b.icon}</span>
          </IconButton>
        ))}
      </Stack>
      <TextField
        inputRef={ref}
        label={label}
        value={value}
        onChange={onChange}
        multiline
        minRows={minRows}
        fullWidth
      />
    </Box>
  );
};
