import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAppDispatch, useAppSelector } from '../store';
import { login, clearError } from '../store/authSlice';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password })).then((result) => {
      if (login.fulfilled.match(result)) {
        navigate('/');
      }
    });
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) => theme.palette.mode === 'light'
          ? 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 90.1%)'
          : 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(9, 13, 22, 1) 90.1%)',
        backgroundColor: 'background.default',
        px: 2,
        py: 4
      }}
    >
      <Container maxWidth="xs" sx={{ p: 0 }}>
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            borderRadius: '16px',
            border: (theme) => theme.palette.mode === 'light'
              ? '1px solid rgba(226, 232, 240, 0.8)'
              : '1px solid rgba(31, 41, 55, 0.8)',
            backgroundColor: 'background.paper',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* Logo Branding */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Logo size="large" />
          </Box>

          <Typography 
            variant="h5" 
            align="center" 
            sx={{ 
              fontWeight: 800, 
              color: 'text.primary',
              letterSpacing: '-0.025em',
              mb: 1
            }}
          >
            Welcome back
          </Typography>
          <Typography 
            variant="body2" 
            align="center" 
            color="text.secondary" 
            sx={{ mb: 3 }}
          >
            Sign in to track your learning journey
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, height: 48, fontSize: '0.975rem' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/register" 
                  sx={{ 
                    color: 'primary.main', 
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Create an account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;