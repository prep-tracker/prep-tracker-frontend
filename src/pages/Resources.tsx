import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl,
  InputLabel, Box, Chip, Alert, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchResources, createResource, updateResource, deleteResource } from '../store/resourceSlice';
import { Resource, ResourceType, Difficulty } from '../types/resource';

const Resources: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useAppSelector((state) => state.resources);
  const { user } = useAppSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [snackbar, setSnackbar] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', url: '', type: ResourceType.ARTICLE,
    difficulty: Difficulty.BEGINNER, category: '', tags: '', notes: ''
  });

  useEffect(() => { dispatch(fetchResources()); }, [dispatch]);

  const filtered = filterType ? items.filter(r => r.type === filterType) : items;

  const isLimitReached = (user?.subscription?.planType || 'FREE') === 'FREE' && items.length >= 3;

  const handleOpen = (resource?: Resource) => {
    if (!resource && isLimitReached) {
      if (window.confirm('You have reached the 3-resource limit on the FREE plan. Would you like to view our subscription plans to upgrade?')) {
        navigate('/subscription');
      }
      return;
    }
    if (resource) {
      setEditing(resource);
      setForm({
        title: resource.title, description: resource.description || '',
        url: resource.url || '', type: resource.type, difficulty: resource.difficulty,
        category: resource.category || '', tags: resource.tags?.join(', ') || '', notes: ''
      });
    } else {
      setEditing(null);
      setForm({ title: '', description: '', url: '', type: ResourceType.ARTICLE, difficulty: Difficulty.BEGINNER, category: '', tags: '', notes: '' });
    }
    setOpen(true);
  };

  const handleSave = () => {
    const data = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
    if (editing) {
      dispatch(updateResource({ id: editing.id, data })).then(() => { setOpen(false); setSnackbar('Resource updated'); });
    } else {
      dispatch(createResource(data))
        .unwrap()
        .then(() => { setOpen(false); setSnackbar('Resource created'); })
        .catch((err: any) => setSnackbar(err));
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this resource?')) {
      dispatch(deleteResource(id)).then(() => setSnackbar('Resource deleted'));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Resources</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Resource</Button>
      </Box>

      {isLimitReached && (
        <Alert severity="warning" sx={{ mb: 2 }} action={
          <Button color="inherit" size="small" onClick={() => navigate('/subscription')}>
            Upgrade
          </Button>
        }>
          You have reached the FREE plan limit of 3 learning resources. Please upgrade to Premium or Pro to create more.
        </Alert>
      )}

      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Filter by Type</InputLabel>
        <Select value={filterType} label="Filter by Type" onChange={e => setFilterType(e.target.value)}>
          <MenuItem value="">All</MenuItem>
          {Object.values(ResourceType).map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.title}</TableCell>
                <TableCell><Chip label={r.type} size="small" /></TableCell>
                <TableCell>{r.difficulty}</TableCell>
                <TableCell>{r.category || '-'}</TableCell>
                <TableCell>{r.tags?.map(t => <Chip key={t} label={t} size="small" sx={{ mr: 0.5 }} />)}</TableCell>
                <TableCell>{r.completed ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(r)}><EditIcon /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(r.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <TextField fullWidth margin="normal" label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} multiline rows={2} />
          <TextField fullWidth margin="normal" label="URL" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select value={form.type} label="Type" onChange={e => setForm({ ...form, type: e.target.value as ResourceType })}>
              {Object.values(ResourceType).map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Difficulty</InputLabel>
            <Select value={form.difficulty} label="Difficulty" onChange={e => setForm({ ...form, difficulty: e.target.value as Difficulty })}>
              {Object.values(Difficulty).map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth margin="normal" label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <TextField fullWidth margin="normal" label="Tags (comma-separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!form.title}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Container>
  );
};

export default Resources;