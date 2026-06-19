import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Paper, List, ListItem, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box,
  Chip, Snackbar, IconButton, Tabs, Tab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchNotes, createNote, updateNote, deleteNote, searchNotesByTags } from '../store/noteSlice';
import { Note } from '../types/note';
import ReactMarkdown from 'react-markdown';

const Notes: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.notes);
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [searchTags, setSearchTags] = useState('');
  const [snackbar, setSnackbar] = useState('');

  const [form, setForm] = useState({ title: '', content: '', tags: '', category: '' });

  useEffect(() => { dispatch(fetchNotes()); }, [dispatch]);

  const handleOpen = (note?: Note) => {
    if (note) {
      setEditing(note);
      setForm({ title: note.title, content: note.content, tags: note.tags?.join(', ') || '', category: note.category || '' });
    } else {
      setEditing(null);
      setForm({ title: '', content: '', tags: '', category: '' });
    }
    setOpen(true);
  };

  const handlePreview = (note: Note) => { setPreviewNote(note); setPreviewOpen(true); };

  const handleSave = () => {
    const data = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
    if (editing) {
      dispatch(updateNote({ id: editing.id, data })).then(() => { setOpen(false); setSnackbar('Note updated'); });
    } else {
      dispatch(createNote(data)).then(() => { setOpen(false); setSnackbar('Note created'); });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this note?')) {
      dispatch(deleteNote(id)).then(() => setSnackbar('Note deleted'));
    }
  };

  const handleSearch = () => {
    if (searchTags.trim()) {
      dispatch(searchNotesByTags(searchTags.split(',').map(t => t.trim()))).then(() => setSnackbar('Search complete'));
    } else {
      dispatch(fetchNotes());
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Notes</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Note</Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField size="small" placeholder="Search by tags (comma-separated)" value={searchTags} onChange={e => setSearchTags(e.target.value)} sx={{ mr: 1, width: 300 }} />
        <Button onClick={handleSearch}>Search</Button>
        {searchTags && <Button onClick={() => { setSearchTags(''); dispatch(fetchNotes()); }}>Clear</Button>}
      </Box>

      <List>
        {items.map(n => (
          <Paper key={n.id} sx={{ mb: 1 }}>
            <ListItem
              secondaryAction={
                <Box>
                  <IconButton size="small" onClick={() => handlePreview(n)}><VisibilityIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleOpen(n)}><EditIcon /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(n.id)}><DeleteIcon /></IconButton>
                </Box>
              }
            >
              <ListItemText primary={n.title} secondary={n.content.substring(0, 100) + (n.content.length > 100 ? '...' : '')} />
            </ListItem>
            {n.tags && n.tags.length > 0 && (
              <Box sx={{ px: 2, pb: 1 }}>
                {n.tags.map(t => <Chip key={t} label={t} size="small" sx={{ mr: 0.5 }} />)}
              </Box>
            )}
          </Paper>
        ))}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Note' : 'Add Note'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <TextField fullWidth margin="normal" label="Content (Markdown)" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} multiline rows={8} required />
          <TextField fullWidth margin="normal" label="Tags (comma-separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
          <TextField fullWidth margin="normal" label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!form.title || !form.content}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{previewNote?.title}</DialogTitle>
        <DialogContent dividers>
          <ReactMarkdown>{previewNote?.content || ''}</ReactMarkdown>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Container>
  );
};

export default Notes;