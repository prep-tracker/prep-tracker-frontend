import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../types/auth';
import authService from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

let initialUser: User | null = null;
let initialToken: string | null = null;

try {
  const savedUser = localStorage.getItem('user');
  initialUser = savedUser ? JSON.parse(savedUser) : null;
  initialToken = localStorage.getItem('token');
} catch (e) {
  console.warn('localStorage is not accessible during auth initialization:', e);
}

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials: { username: string; password: string }, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);
    try {
      localStorage.setItem('token', response.token);
    } catch (e) {
      console.warn('localStorage is not writeable during login:', e);
    }
    const user = await authService.getCurrentUser();
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
      console.warn('localStorage is not writeable during login:', e);
    }
    return { token: response.token, user };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (userData: { username: string; email: string; password: string; fullName?: string }, { rejectWithValue }) => {
  try {
    const response = await authService.register(userData);
    try {
      localStorage.setItem('token', response.token);
    } catch (e) {
      console.warn('localStorage is not writeable during register:', e);
    }
    const user = await authService.getCurrentUser();
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
      console.warn('localStorage is not writeable during register:', e);
    }
    return { token: response.token, user };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
  try {
    return await authService.getCurrentUser();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {
        console.warn('localStorage is not writeable during logout:', e);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;