import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl,
  InputLabel, Box, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchSessions, createSession, updateSession, deleteSession } from '../store/sessionSlice';
import { StudySession } from '../types/session';

const StudySessions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.sessions);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StudySession | null>(null);
  const [snackbar, setSnackbar] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', topic: '', startTime: '',
    endTime: '', duration: undefined as number | undefined, notes: '', resourceId: undefined as number | undefined
  });

  useEffect(() => { dispatch(fetchSessions()); }, [dispatch]);

  const handleOpen = (session?: StudySession) => {
    if (session) {
      setEditing(session);
      setForm({
        title: session.title, description: session.description || '', topic: session.topic || '',
        startTime: session.startTime, endTime: session.endTime || '',
        duration: session.duration,
        notes: session.notes || '', resourceId: session.resourceId
      });
    } else {
      setEditing(null);
      setForm({ title: '', description: '', topic: '', startTime: '', endTime: '', duration: undefined, notes: '', resourceId: undefined });
    }
    setOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      dispatch(updateSession({ id: editing.id, data: form })).then(() => { setOpen(false); setSnackbar('Session updated'); });
    } else {
      dispatch(createSession(form)).then(() => { setOpen(false); setSnackbar('Session created'); });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this session?')) {
      dispatch(deleteSession(id)).then(() => setSnackbar('Session deleted'));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Study Sessions</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Session</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Topic</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Duration (min)</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(s => (
              <TableRow key={s.id}>
                <TableCell>{s.title}</TableCell>
                <TableCell>{s.topic || '-'}</TableCell>
                <TableCell>{new Date(s.startTime).toLocaleString()}</TableCell>
                <TableCell>{s.duration || '-'}</TableCell>
                <TableCell>{s.notes?.substring(0, 50)}{s.notes && s.notes.length > 50 ? '...' : ''}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(s)}><EditIcon /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(s.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Session' : 'Add Session'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <TextField fullWidth margin="normal" label="Topic" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} />
          <TextField fullWidth margin="normal" type="datetime-local" label="Start Time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} InputLabelProps={{ shrink: true }} required />
          <TextField fullWidth margin="normal" type="datetime-local" label="End Time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth margin="normal" type="number" label="Duration (minutes)" value={form.duration || ''} onChange={e => setForm({ ...form, duration: parseInt(e.target.value) || undefined })} />
          <TextField fullWidth margin="normal" label="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} multiline rows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!form.title || !form.startTime}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Container>
  );
};

export default StudySessions;