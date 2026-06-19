import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl,
  InputLabel, Box, Chip, Slider, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchPlans, createPlan, updatePlan, deletePlan } from '../store/planSlice';
import { PreparationPlan, PlanPriority, PlanStatus } from '../types/plan';

const Plans: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.plans);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PreparationPlan | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [snackbar, setSnackbar] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', priority: PlanPriority.MEDIUM,
    status: PlanStatus.BACKLOG, dueDate: '', progress: 0
  });

  useEffect(() => { dispatch(fetchPlans()); }, [dispatch]);

  const filtered = statusFilter ? items.filter(p => p.status === statusFilter) : items;

  const handleOpen = (plan?: PreparationPlan) => {
    if (plan) {
      setEditing(plan);
      setForm({
        title: plan.title, description: plan.description || '', priority: plan.priority,
        status: plan.status, dueDate: plan.dueDate || '', progress: plan.progress
      });
    } else {
      setEditing(null);
      setForm({ title: '', description: '', priority: PlanPriority.MEDIUM, status: PlanStatus.BACKLOG, dueDate: '', progress: 0 });
    }
    setOpen(true);
  };

  const handleSave = () => {
    const data = { ...form, dueDate: form.dueDate || undefined };
    if (editing) {
      dispatch(updatePlan({ id: editing.id, data })).then(() => { setOpen(false); setSnackbar('Plan updated'); });
    } else {
      dispatch(createPlan(data)).then(() => { setOpen(false); setSnackbar('Plan created'); });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this plan?')) {
      dispatch(deletePlan(id)).then(() => setSnackbar('Plan deleted'));
    }
  };

  const getPriorityColor = (p: PlanPriority) => {
    if (p === PlanPriority.URGENT) return 'error';
    if (p === PlanPriority.HIGH) return 'warning';
    return 'default';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Plans</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Plan</Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        {Object.values(PlanStatus).map(s => (
          <Chip key={s} label={s} onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
            color={statusFilter === s ? 'primary' : 'default'} sx={{ mr: 1 }} />
        ))}
        {statusFilter && <Button size="small" onClick={() => setStatusFilter('')}>Clear</Button>}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.title}</TableCell>
                <TableCell><Chip label={p.priority} color={getPriorityColor(p.priority) as any} size="small" /></TableCell>
                <TableCell>{p.status}</TableCell>
                <TableCell>{p.progress}%</TableCell>
                <TableCell>{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(p)}><EditIcon /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(p.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Plan' : 'Add Plan'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <TextField fullWidth margin="normal" label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} multiline rows={2} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select value={form.priority} label="Priority" onChange={e => setForm({ ...form, priority: e.target.value as PlanPriority })}>
              {Object.values(PlanPriority).map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={form.status} label="Status" onChange={e => setForm({ ...form, status: e.target.value as PlanStatus })}>
              {Object.values(PlanStatus).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth margin="normal" type="date" label="Due Date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} InputLabelProps={{ shrink: true }} />
          <Box sx={{ mt: 2, px: 1 }}>
            <Typography>Progress: {form.progress}%</Typography>
            <Slider value={form.progress} onChange={(_, v) => setForm({ ...form, progress: v as number })} min={0} max={100} />
          </Box>
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

export default Plans;