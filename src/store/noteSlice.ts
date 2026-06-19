import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Note, NoteCreateRequest, NoteUpdateRequest } from '../types/note';
import { PageResponse, SearchParams } from '../types/common';
import noteService from '../services/noteService';

interface NoteState {
  items: Note[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: NoteState = {
  items: [],
  totalElements: 0,
  loading: false,
  error: null,
};

export const fetchNotes = createAsyncThunk<any, SearchParams | void>(
  'notes/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await noteService.getAll(params || undefined);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notes');
    }
  }
);

export const createNote = createAsyncThunk(
  'notes/create',
  async (data: NoteCreateRequest, { rejectWithValue }) => {
    try {
      return await noteService.create(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create note');
    }
  }
);

export const updateNote = createAsyncThunk(
  'notes/update',
  async ({ id, data }: { id: number; data: NoteUpdateRequest }, { rejectWithValue }) => {
    try {
      return await noteService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update note');
    }
  }
);

export const deleteNote = createAsyncThunk(
  'notes/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await noteService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete note');
    }
  }
);

export const searchNotesByTags = createAsyncThunk(
  'notes/searchByTags',
  async (tags: string[], { rejectWithValue }) => {
    try {
      return await noteService.searchByTags(tags);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search notes');
    }
  }
);

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action: any) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const idx = state.items.findIndex((n) => n.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n.id !== action.payload);
      })
      .addCase(searchNotesByTags.fulfilled, (state, action: any) => {
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
      });
  },
});

export const { clearError } = noteSlice.actions;
export default noteSlice.reducer;