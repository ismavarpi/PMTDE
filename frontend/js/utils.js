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
  Menu,
  MenuItem
} = MaterialUI;

const formatDate = () => {
  const d = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())} ${pad(d.getHours())}${pad(d.getMinutes())}`;
};

const normalize = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const api = {
  list: async (entity) => {
    const res = await fetch(`/api/${entity}`);
    return res.json();
  },
  save: async (entity, record) => {
    const method = record.id ? 'PUT' : 'POST';
    const url = record.id ? `/api/${entity}/${record.id}` : `/api/${entity}`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },
  remove: async (entity, id) => {
    await fetch(`/api/${entity}/${id}`, { method: 'DELETE' });
  },
};
