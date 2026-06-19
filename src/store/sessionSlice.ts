import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { StudySession, SessionCreateRequest, SessionUpdateRequest } from '../types/session';
import { PageResponse, SearchParams } from '../types/common';
import sessionService from '../services/sessionService';

interface SessionState {
  items: StudySession[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  items: [],
  totalElements: 0,
  loading: false,
  error: null,
};

export const fetchSessions = createAsyncThunk<any, SearchParams | void>(
  'sessions/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await sessionService.getAll(params || undefined);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sessions');
    }
  }
);

export const createSession = createAsyncThunk(
  'sessions/create',
  async (data: SessionCreateRequest, { rejectWithValue }) => {
    try {
      return await sessionService.create(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create session');
    }
  }
);

export const updateSession = createAsyncThunk(
  'sessions/update',
  async ({ id, data }: { id: number; data: SessionUpdateRequest }, { rejectWithValue }) => {
    try {
      return await sessionService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update session');
    }
  }
);

export const deleteSession = createAsyncThunk(
  'sessions/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await sessionService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete session');
    }
  }
);

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action: any) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateSession.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload);
      });
  },
});

export const { clearError } = sessionSlice.actions;
export default sessionSlice.reducer;