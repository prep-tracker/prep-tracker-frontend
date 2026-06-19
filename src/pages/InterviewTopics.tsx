import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl,
  InputLabel, Box, LinearProgress, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchInterviewTopics, createInterviewTopic, updateInterviewTopic, deleteInterviewTopic } from '../store/interviewSlice';
import { InterviewTopic, InterviewTopicStatus } from '../types/interview';

const InterviewTopics: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.interviewTopics);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<InterviewTopic | null>(null);
  const [snackbar, setSnackbar] = useState('');

  const [form, setForm] = useState({
    topic: '', category: '', description: '', status: InterviewTopicStatus.NOT_STARTED,
    difficulty: '', questionsTotal: 0, notes: ''
  });

  useEffect(() => { dispatch(fetchInterviewTopics()); }, [dispatch]);

  const handleOpen = (item?: InterviewTopic) => {
    if (item) {
      setEditing(item);
      setForm({
        topic: item.topic, category: item.category || '', description: item.description || '',
        status: item.status, difficulty: item.difficulty || '',
        questionsTotal: item.questionsTotal, notes: item.notes || ''
      });
    } else {
      setEditing(null);
      setForm({ topic: '', category: '', description: '', status: InterviewTopicStatus.NOT_STARTED, difficulty: '', questionsTotal: 0, notes: '' });
    }
    setOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      dispatch(updateInterviewTopic({ id: editing.id, data: form })).then(() => { setOpen(false); setSnackbar('Topic updated'); });
    } else {
      dispatch(createInterviewTopic(form)).then(() => { setOpen(false); setSnackbar('Topic created'); });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this topic?')) {
      dispatch(deleteInterviewTopic(id)).then(() => setSnackbar('Topic deleted'));
    }
  };

  const getProgress = (item: InterviewTopic) => item.questionsTotal > 0 ? (item.questionsSolved / item.questionsTotal) * 100 : 0;

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Interview Topics</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Topic</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Topic</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Progress (Solved/Total)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(t => (
              <TableRow key={t.id}>
                <TableCell>{t.topic}</TableCell>
                <TableCell>{t.category || '-'}</TableCell>
                <TableCell>{t.difficulty || '-'}</TableCell>
                <TableCell>{t.status}</TableCell>
                <TableCell sx={{ minWidth: 150 }}>
                  <LinearProgress variant="determinate" value={getProgress(t)} sx={{ mb: 0.5 }} />
                  <Typography variant="caption">{t.questionsSolved} / {t.questionsTotal}</Typography>
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(t)}><EditIcon /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(t.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Topic" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} required />
          <TextField fullWidth margin="normal" label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <TextField fullWidth margin="normal" label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} multiline rows={2} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={form.status} label="Status" onChange={e => setForm({ ...form, status: e.target.value as InterviewTopicStatus })}>
              {Object.values(InterviewTopicStatus).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth margin="normal" label="Difficulty" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} />
          <TextField fullWidth margin="normal" type="number" label="Total Questions" value={form.questionsTotal} onChange={e => setForm({ ...form, questionsTotal: parseInt(e.target.value) || 0 })} inputProps={{ min: 0 }} />
          <TextField fullWidth margin="normal" label="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!form.topic}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Container>
  );
};

export default InterviewTopics;