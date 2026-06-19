import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Resource, ResourceCreateRequest, ResourceUpdateRequest } from '../types/resource';
import { PageResponse, SearchParams } from '../types/common';
import resourceService from '../services/resourceService';

interface ResourceState {
  items: Resource[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: ResourceState = { items: [], totalElements: 0, loading: false, error: null };

export const fetchResources = createAsyncThunk<any, SearchParams | void>('resources/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await resourceService.getAll(params || undefined);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch resources');
  }
});

export const createResource = createAsyncThunk('resources/create', async (data: ResourceCreateRequest, { rejectWithValue }) => {
  try {
    return await resourceService.create(data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create resource');
  }
});

export const updateResource = createAsyncThunk('resources/update', async ({ id, data }: { id: number; data: ResourceUpdateRequest }, { rejectWithValue }) => {
  try {
    return await resourceService.update(id, data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update resource');
  }
});

export const deleteResource = createAsyncThunk('resources/delete', async (id: number, { rejectWithValue }) => {
  try {
    await resourceService.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete resource');
  }
});

const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => { state.loading = true; })
      .addCase(fetchResources.fulfilled, (state, action: any) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchResources.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createResource.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateResource.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export default resourceSlice.reducer;