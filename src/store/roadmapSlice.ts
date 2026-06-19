import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Roadmap, RoadmapItem, RoadmapCreateRequest, RoadmapUpdateRequest, RoadmapItemCreateRequest, RoadmapItemUpdateRequest } from '../types/roadmap';
import { PageResponse, SearchParams } from '../types/common';
import roadmapService from '../services/roadmapService';

interface RoadmapState {
  items: Roadmap[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: RoadmapState = {
  items: [],
  totalElements: 0,
  loading: false,
  error: null,
};

export const fetchRoadmaps = createAsyncThunk<any, SearchParams | void>(
  'roadmaps/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await roadmapService.getAll(params || undefined);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch roadmaps');
    }
  }
);

export const createRoadmap = createAsyncThunk(
  'roadmaps/create',
  async (data: RoadmapCreateRequest, { rejectWithValue }) => {
    try {
      return await roadmapService.create(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create roadmap');
    }
  }
);

export const updateRoadmap = createAsyncThunk(
  'roadmaps/update',
  async ({ id, data }: { id: number; data: RoadmapUpdateRequest }, { rejectWithValue }) => {
    try {
      return await roadmapService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update roadmap');
    }
  }
);

export const deleteRoadmap = createAsyncThunk(
  'roadmaps/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await roadmapService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete roadmap');
    }
  }
);

export const addRoadmapItem = createAsyncThunk(
  'roadmaps/addItem',
  async ({ roadmapId, data }: { roadmapId: number; data: RoadmapItemCreateRequest }, { rejectWithValue }) => {
    try {
      return await roadmapService.addItem(roadmapId, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add roadmap item');
    }
  }
);

export const updateRoadmapItem = createAsyncThunk(
  'roadmaps/updateItem',
  async ({ roadmapId, itemId, data }: { roadmapId: number; itemId: number; data: RoadmapItemUpdateRequest }, { rejectWithValue }) => {
    try {
      const item = await roadmapService.updateItem(roadmapId, itemId, data);
      return { roadmapId, item };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update roadmap item');
    }
  }
);

export const deleteRoadmapItem = createAsyncThunk(
  'roadmaps/deleteItem',
  async ({ roadmapId, itemId }: { roadmapId: number; itemId: number }, { rejectWithValue }) => {
    try {
      await roadmapService.deleteItem(roadmapId, itemId);
      return { roadmapId, itemId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete roadmap item');
    }
  }
);

const roadmapSlice = createSlice({
  name: 'roadmaps',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoadmaps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoadmaps.fulfilled, (state, action: any) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchRoadmaps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createRoadmap.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateRoadmap.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteRoadmap.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      })
      .addCase(updateRoadmapItem.fulfilled, (state, action: any) => {
        const roadmap = state.items.find((r) => r.id === action.payload.roadmapId);
        if (roadmap) {
          const idx = roadmap.items.findIndex((i) => i.id === action.payload.item.id);
          if (idx !== -1) roadmap.items[idx] = action.payload.item;
        }
      });
  },
});

export const { clearError } = roadmapSlice.actions;
export default roadmapSlice.reducer;