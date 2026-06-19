import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl,
  InputLabel, Box, LinearProgress, Snackbar, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchGoals, createGoal, updateGoal, deleteGoal } from '../store/goalSlice';
import { Goal, GoalStatus } from '../types/goal';

const Goals: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector((state) => state.goals);
  const { user } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [snackbar, setSnackbar] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', status: GoalStatus.DRAFT,
    targetDate: '', progress: 0
  });

  useEffect(() => { dispatch(fetchGoals()); }, [dispatch]);

  const isLimitReached = (user?.subscription?.planType || 'FREE') === 'FREE' && items.length >= 3;

  const handleOpen = (goal?: Goal) => {
    if (!goal && isLimitReached) {
      if (window.confirm('You have reached the 3-goal limit on the FREE plan. Would you like to view our subscription plans to upgrade?')) {
        navigate('/subscription');
      }
      return;
    }
    if (goal) {
      setEditing(goal);
      setForm({
        title: goal.title, description: goal.description || '',
        status: goal.status, targetDate: goal.targetDate || '', progress: goal.progress
      });
    } else {
      setEditing(null);
      setForm({ title: '', description: '', status: GoalStatus.DRAFT, targetDate: '', progress: 0 });
    }
    setOpen(true);
  };

  const handleSave = () => {
    const data = { ...form, targetDate: form.targetDate || undefined };
    if (editing) {
      dispatch(updateGoal({ id: editing.id, data })).then(() => { setOpen(false); setSnackbar('Goal updated'); });
    } else {
      dispatch(createGoal(data))
        .unwrap()
        .then(() => { setOpen(false); setSnackbar('Goal created'); })
        .catch((err: any) => setSnackbar(err));
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this goal?')) {
      dispatch(deleteGoal(id)).then(() => setSnackbar('Goal deleted'));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Goals</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Goal</Button>
      </Box>

      {isLimitReached && (
        <Alert severity="warning" sx={{ mb: 2 }} action={
          <Button color="inherit" size="small" onClick={() => navigate('/subscription')}>
            Upgrade
          </Button>
        }>
          You have reached the FREE plan limit of 3 goals. Please upgrade to Premium or Pro to create more.
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Target Date</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(g => (
              <TableRow key={g.id}>
                <TableCell>{g.title}</TableCell>
                <TableCell>{g.status}</TableCell>
                <TableCell>{g.targetDate ? new Date(g.targetDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell sx={{ minWidth: 120 }}>
                  <LinearProgress variant="determinate" value={g.progress} sx={{ mb: 0.5 }} />
                  <Typography variant="caption">{g.progress}%</Typography>
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(g)}><EditIcon /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(g.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Goal' : 'Add Goal'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <TextField fullWidth margin="normal" label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} multiline rows={2} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={form.status} label="Status" onChange={e => setForm({ ...form, status: e.target.value as GoalStatus })}>
              {Object.values(GoalStatus).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth margin="normal" type="date" label="Target Date" value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} InputLabelProps={{ shrink: true }} />
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

export default Goals;