import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Revision, RevisionCreateRequest, RevisionUpdateRequest } from '../types/revision';
import { PageResponse, SearchParams } from '../types/common';
import revisionService from '../services/revisionService';

interface RevisionState {
  items: Revision[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: RevisionState = {
  items: [],
  totalElements: 0,
  loading: false,
  error: null,
};

export const fetchRevisions = createAsyncThunk<any, SearchParams | void>(
  'revisions/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await revisionService.getAll(params || undefined);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch revisions');
    }
  }
);

export const createRevision = createAsyncThunk(
  'revisions/create',
  async (data: RevisionCreateRequest, { rejectWithValue }) => {
    try {
      return await revisionService.create(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create revision');
    }
  }
);

export const updateRevision = createAsyncThunk(
  'revisions/update',
  async ({ id, data }: { id: number; data: RevisionUpdateRequest }, { rejectWithValue }) => {
    try {
      return await revisionService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update revision');
    }
  }
);

export const deleteRevision = createAsyncThunk(
  'revisions/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await revisionService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete revision');
    }
  }
);

const revisionSlice = createSlice({
  name: 'revisions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevisions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevisions.fulfilled, (state, action: any) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchRevisions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createRevision.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateRevision.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteRevision.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export const { clearError } = revisionSlice.actions;
export default revisionSlice.reducer;