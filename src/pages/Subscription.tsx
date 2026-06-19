import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent, CardActions,
  Button, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, CircularProgress, Alert, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Divider
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import HistoryIcon from '@mui/icons-material/History';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchSubscription, upgradeSubscription, cancelSubscription,
  fetchPaymentHistory, resetUpgradeSuccess, clearError
} from '../store/subscriptionSlice';
import { getCurrentUser } from '../store/authSlice';
import { PlanType } from '../types/subscription';

const PLAN_FEATURES = {
  FREE: [
    'Max 3 Goals tracker',
    'Max 3 Resources organizer',
    'Max 2 Roadmaps generator',
    'Max 1 Certification prep planner',
    'Standard community support'
  ],
  PREMIUM: [
    'Unlimited Goals tracker',
    'Unlimited Resources organizer',
    'Unlimited Roadmaps generator',
    'Up to 5 Certifications planner',
    'Revision intervals priority setup',
    'Priority customer support'
  ],
  PRO: [
    'Unlimited Goals tracker',
    'Unlimited Resources organizer',
    'Unlimited Roadmaps generator',
    'Unlimited Certifications planner',
    'AI-powered roadmap planner recommendations',
    'Advanced revision smart analytics',
    '24/7 Priority VIP support'
  ]
};

const SubscriptionPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const { currentSubscription, payments, loading, error, upgradeSuccess } = useAppSelector((state) => state.subscription);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('PREMIUM');
  const [processingState, setProcessingState] = useState<'idle' | 'verifying' | 'authorizing' | 'finalizing' | 'success'>('idle');
  
  const [form, setForm] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    dispatch(fetchSubscription());
    dispatch(fetchPaymentHistory());
  }, [dispatch]);

  useEffect(() => {
    if (upgradeSuccess) {
      setProcessingState('success');
      dispatch(getCurrentUser()); // Refresh user profile in global auth state (to sync plan limits)
      dispatch(fetchPaymentHistory()); // Refresh invoice logs
      const timer = setTimeout(() => {
        setCheckoutOpen(false);
        setProcessingState('idle');
        dispatch(resetUpgradeSuccess());
        setForm({ cardholderName: '', cardNumber: '', expiryDate: '', cvv: '' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [upgradeSuccess, dispatch]);

  const handleOpenCheckout = (plan: PlanType) => {
    setSelectedPlan(plan);
    setValidationError('');
    setForm({ cardholderName: '', cardNumber: '', expiryDate: '', cvv: '' });
    setCheckoutOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateCardDetails = () => {
    if (!form.cardholderName.trim()) return 'Cardholder Name is required';
    if (!/^\d{16}$/.test(form.cardNumber.replace(/\s+/g, ''))) return 'Invalid Card Number (must be 16 digits)';
    if (!/^\d{2}\/\d{2}$/.test(form.expiryDate)) return 'Invalid Expiry Date (format MM/YY)';
    if (!/^\d{3}$/.test(form.cvv)) return 'Invalid CVV (must be 3 digits)';
    return '';
  };

  const handlePay = async () => {
    const err = validateCardDetails();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError('');

    // Trigger mock checkout step animations
    setProcessingState('verifying');
    setTimeout(() => {
      setProcessingState('authorizing');
      setTimeout(() => {
        setProcessingState('finalizing');
        // Finalize transaction with API call
        dispatch(upgradeSubscription({
          planType: selectedPlan,
          cardholderName: form.cardholderName,
          cardNumber: form.cardNumber,
          expiryDate: form.expiryDate,
          cvv: form.cvv
        }));
      }, 1000);
    }, 1000);
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel your Premium subscription? Your plan will be downgraded to Free instantly.')) {
      dispatch(cancelSubscription()).then(() => {
        dispatch(getCurrentUser());
      });
    }
  };

  const formatPrice = (plan: PlanType) => {
    if (plan === 'FREE') return '$0';
    if (plan === 'PREMIUM') return '$9.99';
    return '$19.99';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom sx={{
          background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Choose Your Preparation Journey
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Unlock unlimited resources, goals tracker, personalized roadmaps, and certification prep metrics.
        </Typography>
        
        {currentSubscription && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Chip 
              label={`Current Plan: ${currentSubscription.planType}`} 
              color={currentSubscription.planType === 'FREE' ? 'default' : 'primary'} 
              variant="filled" 
              sx={{ fontWeight: 'bold', px: 1.5, py: 0.5 }}
            />
            {currentSubscription.planType !== 'FREE' && (
              <Button size="small" variant="text" color="error" onClick={handleCancel}>
                Cancel Subscription
              </Button>
            )}
          </Box>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }} onClose={() => dispatch(clearError())}>{error}</Alert>}

      <Grid container spacing={4} alignItems="stretch" sx={{ mb: 6 }}>
        {/* FREE PLAN */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            border: currentSubscription?.planType === 'FREE' ? '2.5px solid #757575' : '1px solid rgba(255, 255, 255, 0.08)',
            transform: currentSubscription?.planType === 'FREE' ? 'scale(1.02)' : 'none',
            boxShadow: currentSubscription?.planType === 'FREE' ? 4 : 1,
            transition: '0.3s'
          }}>
            <CardContent sx={{ flexGrow: 1, p: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>Free Plan</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                <Typography variant="h3" fontWeight={700}>{formatPrice('FREE')}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>/month</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List dense>
                {PLAN_FEATURES.FREE.map((feat) => (
                  <ListItem key={feat} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText primary={feat} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0 }}>
              <Button fullWidth variant="outlined" disabled={currentSubscription?.planType === 'FREE'}>
                {currentSubscription?.planType === 'FREE' ? 'Current Active Plan' : 'Free Default'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* PREMIUM PLAN */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            border: currentSubscription?.planType === 'PREMIUM' ? '2.5px solid #3f51b5' : '1px solid rgba(255, 255, 255, 0.08)',
            transform: currentSubscription?.planType === 'PREMIUM' ? 'scale(1.02)' : 'none',
            boxShadow: currentSubscription?.planType === 'PREMIUM' ? 5 : 1,
            position: 'relative',
            transition: '0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 6
            }
          }}>
            <Box sx={{
              position: 'absolute', top: 12, right: 12, bgcolor: 'primary.main', color: 'white',
              px: 1.5, py: 0.2, borderRadius: 5, display: 'flex', alignItems: 'center', gap: 0.5
            }}>
              <StarIcon fontSize="small" />
              <Typography variant="caption" fontWeight="bold">POPULAR</Typography>
            </Box>
            <CardContent sx={{ flexGrow: 1, p: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom color="primary">Premium Plan</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                <Typography variant="h3" fontWeight={700}>{formatPrice('PREMIUM')}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>/month</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List dense>
                {PLAN_FEATURES.PREMIUM.map((feat) => (
                  <ListItem key={feat} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText primary={feat} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0 }}>
              <Button 
                fullWidth 
                variant="contained" 
                color="primary"
                onClick={() => handleOpenCheckout('PREMIUM')}
                disabled={currentSubscription?.planType === 'PREMIUM'}
              >
                {currentSubscription?.planType === 'PREMIUM' ? 'Current Active Plan' : 'Upgrade to Premium'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* PRO PLAN */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            border: currentSubscription?.planType === 'PRO' ? '2.5px solid #f50057' : '1px solid rgba(255, 255, 255, 0.08)',
            transform: currentSubscription?.planType === 'PRO' ? 'scale(1.02)' : 'none',
            boxShadow: currentSubscription?.planType === 'PRO' ? 5 : 1,
            position: 'relative',
            transition: '0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 6
            }
          }}>
            <Box sx={{
              position: 'absolute', top: 12, right: 12, bgcolor: '#f50057', color: 'white',
              px: 1.5, py: 0.2, borderRadius: 5, display: 'flex', alignItems: 'center', gap: 0.5
            }}>
              <WorkspacePremiumIcon fontSize="small" />
              <Typography variant="caption" fontWeight="bold">VIP PRO</Typography>
            </Box>
            <CardContent sx={{ flexGrow: 1, p: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom color="secondary">Pro Plan</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                <Typography variant="h3" fontWeight={700}>{formatPrice('PRO')}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>/month</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List dense>
                {PLAN_FEATURES.PRO.map((feat) => (
                  <ListItem key={feat} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText primary={feat} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0 }}>
              <Button 
                fullWidth 
                variant="contained" 
                color="secondary"
                onClick={() => handleOpenCheckout('PRO')}
                disabled={currentSubscription?.planType === 'PRO'}
              >
                {currentSubscription?.planType === 'PRO' ? 'Current Active Plan' : 'Upgrade to Pro'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* BILLING / INVOICES HISTORY */}
      <Box sx={{ mt: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <HistoryIcon />
          <Typography variant="h5" fontWeight={600}>Billing & Payment History</Typography>
        </Box>
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Plan Level</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No transactions recorded yet.</TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 500 }}>{payment.transactionId}</TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={payment.planType} 
                        color={payment.planType === 'PRO' ? 'secondary' : 'primary'}
                      />
                    </TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{payment.paymentMethod}</TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={payment.paymentStatus} 
                        color="success" 
                        variant="outlined" 
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* CHECKOUT MODAL PAYMENT */}
      <Dialog open={checkoutOpen} onClose={() => processingState === 'idle' && setCheckoutOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
          <CreditCardIcon color="primary" />
          Secure checkout
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Upgrade plan:</Typography>
            <Typography variant="h6" fontWeight="bold">{selectedPlan} Plan — {formatPrice(selectedPlan)}/month</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {processingState === 'idle' && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {validationError && <Alert severity="warning">{validationError}</Alert>}
              <TextField 
                label="Cardholder Name" 
                name="cardholderName" 
                value={form.cardholderName} 
                onChange={handleInputChange} 
                size="small" 
                required 
                fullWidth 
              />
              <TextField 
                label="Card Number (16 digits)" 
                name="cardNumber" 
                value={form.cardNumber} 
                onChange={handleInputChange} 
                size="small" 
                required 
                fullWidth 
                inputProps={{ maxLength: 16 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={7}>
                  <TextField 
                    label="Expiry Date (MM/YY)" 
                    name="expiryDate" 
                    placeholder="MM/YY" 
                    value={form.expiryDate} 
                    onChange={handleInputChange} 
                    size="small" 
                    required 
                    fullWidth 
                    inputProps={{ maxLength: 5 }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField 
                    label="CVV (3 digits)" 
                    name="cvv" 
                    type="password" 
                    value={form.cvv} 
                    onChange={handleInputChange} 
                    size="small" 
                    required 
                    fullWidth 
                    inputProps={{ maxLength: 3 }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, color: 'text.secondary' }}>
                <LockIcon fontSize="small" />
                <Typography variant="caption">All transactions are fully secured & encrypted.</Typography>
              </Box>
            </Box>
          )}

          {processingState !== 'idle' && processingState !== 'success' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 2 }}>
              <CircularProgress size={50} />
              <Typography variant="body1" fontWeight={600}>
                {processingState === 'verifying' && 'Securing connection details...'}
                {processingState === 'authorizing' && 'Contacting bank authorization gateway...'}
                {processingState === 'finalizing' && 'Confirming upgrade with tracker profile...'}
              </Typography>
            </Box>
          )}

          {processingState === 'success' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 2, color: 'success.main' }}>
              <CheckCircleIcon sx={{ fontSize: 60 }} />
              <Typography variant="h5" fontWeight="bold">Upgrade Complete!</Typography>
              <Typography variant="body2" color="text.secondary">Welcome to your new plan tier.</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {processingState === 'idle' && (
            <>
              <Button onClick={() => setCheckoutOpen(false)}>Cancel</Button>
              <Button 
                onClick={handlePay} 
                variant="contained" 
                color={selectedPlan === 'PRO' ? 'secondary' : 'primary'}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : `Pay ${formatPrice(selectedPlan)}`}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubscriptionPage;
