import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Box, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchRevisions, createRevision, updateRevision, deleteRevision } from '../store/revisionSlice';
import { Revision } from '../types/revision';

const Revisions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.revisions);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Revision | null>(null);
  const [snackbar, setSnackbar] = useState('');

  const [form, setForm] = useState({
    topic: '', description: '', resourceId: undefined as number | undefined,
    priority: 1, nextRevisionAt: '', notes: ''
  });

  useEffect(() => { dispatch(fetchRevisions()); }, [dispatch]);

  const handleOpen = (revision?: Revision) => {
    if (revision) {
      setEditing(revision);
      setForm({
        topic: revision.topic, description: revision.description || '',
        resourceId: revision.resourceId, priority: revision.priority,
        nextRevisionAt: revision.nextRevisionAt.split('T')[0], notes: revision.notes || ''
      });
    } else {
      setEditing(null);
      setForm({ topic: '', description: '', resourceId: undefined, priority: 1, nextRevisionAt: '', notes: '' });
    }
    setOpen(true);
  };

  const handleSave = () => {
    const data = { ...form, nextRevisionAt: form.nextRevisionAt };
    if (editing) {
      dispatch(updateRevision({ id: editing.id, data })).then(() => { setOpen(false); setSnackbar('Revision updated'); });
    } else {
      dispatch(createRevision(data)).then(() => { setOpen(false); setSnackbar('Revision created'); });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this revision?')) {
      dispatch(deleteRevision(id)).then(() => setSnackbar('Revision deleted'));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Revisions</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Revision</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Topic</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Times Revised</TableCell>
              <TableCell>Confidence</TableCell>
              <TableCell>Next Revision</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.topic}</TableCell>
                <TableCell>{r.priority}</TableCell>
                <TableCell>{r.timesRevised}</TableCell>
                <TableCell>{r.confidence}%</TableCell>
                <TableCell>{new Date(r.nextRevisionAt).toLocaleDateString()}</TableCell>
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
        <DialogTitle>{editing ? 'Edit Revision' : 'Add Revision'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Topic" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} required />
          <TextField fullWidth margin="normal" label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} multiline rows={2} />
          <TextField fullWidth margin="normal" type="number" label="Priority" value={form.priority} onChange={e => setForm({ ...form, priority: parseInt(e.target.value) || 1 })} inputProps={{ min: 1, max: 5 }} />
          <TextField fullWidth margin="normal" type="date" label="Next Revision Date" value={form.nextRevisionAt} onChange={e => setForm({ ...form, nextRevisionAt: e.target.value })} InputLabelProps={{ shrink: true }} required />
          <TextField fullWidth margin="normal" label="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!form.topic || !form.nextRevisionAt}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Container>
  );
};

export default Revisions;