const {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Card,
  CardContent,
  Autocomplete,
  Tooltip,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItem,
  Collapse,
  Menu,
  MenuItem,
  Select,
  Checkbox,
  FormControlLabel,
  Snackbar,
} = MaterialUI;

const formatDate = () => {
  const d = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const exportToCSV = (headers, rows, entity) => {
  const formatValue = (v) => {
    if (v instanceof Date) return `"${v.toISOString().split('T')[0]}"`;
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) return `"${v}"`;
    return v ?? '';
    };
  let csv = headers.join(';') + '\n';
  rows.forEach((r) => {
    csv += r.map(formatValue).join(';') + '\n';
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${formatDate()} ${entity}.csv`;
  link.click();
};

const normalize = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const tableHeadSx = { backgroundColor: '#f5f5f5', '& th': { fontWeight: 'bold' } };
