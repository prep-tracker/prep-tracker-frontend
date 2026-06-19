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
import { fetchCertifications, createCertification, updateCertification, deleteCertification } from '../store/certificationSlice';
import { Certification, CertificationStatus } from '../types/certification';

const Certifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector((state) => state.certifications);
  const { user } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [snackbar, setSnackbar] = useState('');

  const [form, setForm] = useState({
    name: '', provider: '', description: '', status: CertificationStatus.PLANNED,
    targetDate: '', expiryDate: '', credentialId: '', notes: '', progress: 0
  });

  useEffect(() => { dispatch(fetchCertifications()); }, [dispatch]);

  const plan = user?.subscription?.planType || 'FREE';
  const isLimitReached = (plan === 'FREE' && items.length >= 1) || (plan === 'PREMIUM' && items.length >= 5);

  const handleOpen = (cert?: Certification) => {
    if (!cert && isLimitReached) {
      if (window.confirm(`You have reached the certification limit on the ${plan} plan (Max ${plan === 'FREE' ? 1 : 5}). Would you like to view our subscription plans to upgrade?`)) {
        navigate('/subscription');
      }
      return;
    }
    if (cert) {
      setEditing(cert);
      setForm({
        name: cert.name, provider: cert.provider || '', description: cert.description || '',
        status: cert.status, targetDate: cert.targetDate || '', expiryDate: cert.expiryDate || '',
        credentialId: cert.credentialId || '', notes: cert.notes || '', progress: cert.progress
      });
    } else {
      setEditing(null);
      setForm({ name: '', provider: '', description: '', status: CertificationStatus.PLANNED, targetDate: '', expiryDate: '', credentialId: '', notes: '', progress: 0 });
    }
    setOpen(true);
  };

  const handleSave = () => {
    const data = { ...form, targetDate: form.targetDate || undefined, expiryDate: form.expiryDate || undefined };
    if (editing) {
      dispatch(updateCertification({ id: editing.id, data })).then(() => { setOpen(false); setSnackbar('Certification updated'); });
    } else {
      dispatch(createCertification(data))
        .unwrap()
        .then(() => { setOpen(false); setSnackbar('Certification created'); })
        .catch((err: any) => setSnackbar(err));
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this certification?')) {
      dispatch(deleteCertification(id)).then(() => setSnackbar('Certification deleted'));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Certifications</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Certification</Button>
      </Box>

      {isLimitReached && (
        <Alert severity="warning" sx={{ mb: 2 }} action={
          <Button color="inherit" size="small" onClick={() => navigate('/subscription')}>
            Upgrade
          </Button>
        }>
          You have reached the {plan} plan limit of {plan === 'FREE' ? 1 : 5} certifications. Please upgrade your subscription tier to create more.
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Target Date</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.provider || '-'}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>{c.targetDate ? new Date(c.targetDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell sx={{ minWidth: 150 }}>
                  <LinearProgress variant="determinate" value={c.progress} sx={{ mb: 0.5 }} />
                  <Typography variant="caption">{c.progress}%</Typography>
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(c)}><EditIcon /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(c.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <TextField fullWidth margin="normal" label="Provider" value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} />
          <TextField fullWidth margin="normal" label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} multiline rows={2} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={form.status} label="Status" onChange={e => setForm({ ...form, status: e.target.value as CertificationStatus })}>
              {Object.values(CertificationStatus).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth margin="normal" type="date" label="Target Date" value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth margin="normal" type="date" label="Expiry Date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth margin="normal" type="number" label="Progress" value={form.progress} onChange={e => setForm({ ...form, progress: parseInt(e.target.value) || 0 })} inputProps={{ min: 0, max: 100 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!form.name}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Container>
  );
};

export default Certifications;