import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Paper, Accordion, AccordionSummary,
  AccordionDetails, List, ListItem, ListItemIcon, ListItemText, Checkbox,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, IconButton,
  Snackbar, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchRoadmaps, createRoadmap, deleteRoadmap, updateRoadmapItem } from '../store/roadmapSlice';
import { Roadmap, RoadmapItemStatus } from '../types/roadmap';

const Roadmaps: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector((state) => state.roadmaps);
  const { user } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [snackbar, setSnackbar] = useState('');

  const [form, setForm] = useState({ title: '', description: '', targetDate: '' });
  const [itemsList, setItemsList] = useState<Array<{ title: string; description: string }>>([]);

  useEffect(() => { dispatch(fetchRoadmaps()); }, [dispatch]);

  const isLimitReached = (user?.subscription?.planType || 'FREE') === 'FREE' && items.length >= 2;

  const handleOpen = () => {
    if (isLimitReached) {
      if (window.confirm('You have reached the 2-roadmap limit on the FREE plan. Would you like to view our subscription plans to upgrade?')) {
        navigate('/subscription');
      }
      return;
    }
    setForm({ title: '', description: '', targetDate: '' });
    setItemsList([{ title: '', description: '' }]);
    setOpen(true);
  };

  const addItem = () => { setItemsList([...itemsList, { title: '', description: '' }]); };
  const updateItem = (idx: number, field: 'title' | 'description', value: string) => {
    const updated = [...itemsList];
    updated[idx][field] = value;
    setItemsList(updated);
  };

  const handleSave = () => {
    const validItems = itemsList.filter(i => i.title.trim());
    dispatch(createRoadmap({ ...form, targetDate: form.targetDate || undefined }))
      .unwrap()
      .then((result: any) => {
        if (result?.id) {
          validItems.forEach(item => {
            // Items would be added via addRoadmapItem in a full implementation
          });
        }
        setOpen(false);
        setSnackbar('Roadmap created');
      })
      .catch((err: any) => setSnackbar(err));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this roadmap?')) {
      dispatch(deleteRoadmap(id)).then(() => setSnackbar('Roadmap deleted'));
    }
  };

  const toggleItemStatus = (roadmap: Roadmap, itemId: number, currentStatus: RoadmapItemStatus) => {
    const nextStatus = currentStatus === RoadmapItemStatus.COMPLETED ? RoadmapItemStatus.NOT_STARTED : RoadmapItemStatus.COMPLETED;
    dispatch(updateRoadmapItem({ roadmapId: roadmap.id, itemId, data: { status: nextStatus } }));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Roadmaps</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>Add Roadmap</Button>
      </Box>

      {isLimitReached && (
        <Alert severity="warning" sx={{ mb: 2 }} action={
          <Button color="inherit" size="small" onClick={() => navigate('/subscription')}>
            Upgrade
          </Button>
        }>
          You have reached the FREE plan limit of 2 roadmaps. Please upgrade to Premium or Pro to create more.
        </Alert>
      )}

      {items.map(r => (
        <Accordion key={r.id} expanded={expanded === `roadmap-${r.id}`} onChange={(_, isExpanded) => setExpanded(isExpanded ? `roadmap-${r.id}` : false)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ flexGrow: 1 }}>{r.title}</Typography>
            <Typography variant="caption" sx={{ mr: 2 }}>{r.progress}% complete</Typography>
            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}><DeleteIcon /></IconButton>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>{r.description}</Typography>
            <List>
              {r.items.map(item => (
                <ListItem key={item.id} divider>
                  <ListItemIcon>
                    <Checkbox
                      checked={item.status === RoadmapItemStatus.COMPLETED}
                      onChange={() => toggleItemStatus(r, item.id, item.status)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    secondary={item.description}
                    sx={{ textDecoration: item.status === RoadmapItemStatus.COMPLETED ? 'line-through' : 'none' }}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Roadmap</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <TextField fullWidth margin="normal" label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} multiline rows={2} />
          <TextField fullWidth margin="normal" type="date" label="Target Date" value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} InputLabelProps={{ shrink: true }} />
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Items</Typography>
          {itemsList.map((item, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <TextField size="small" placeholder="Item title" value={item.title} onChange={e => updateItem(idx, 'title', e.target.value)} sx={{ mr: 1, width: '60%' }} />
              <TextField size="small" placeholder="Description" value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} sx={{ width: '38%' }} />
            </Box>
          ))}
          <Button size="small" onClick={addItem}>+ Add Item</Button>
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

export default Roadmaps;