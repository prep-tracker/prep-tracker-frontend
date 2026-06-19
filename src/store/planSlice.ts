import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PreparationPlan, PlanCreateRequest, PlanUpdateRequest } from '../types/plan';
import { PageResponse, SearchParams } from '../types/common';
import planService from '../services/planService';

interface PlanState {
  items: PreparationPlan[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: PlanState = {
  items: [],
  totalElements: 0,
  loading: false,
  error: null,
};

export const fetchPlans = createAsyncThunk<any, SearchParams | void>(
  'plans/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await planService.getAll(params || undefined);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plans');
    }
  }
);

export const createPlan = createAsyncThunk(
  'plans/create',
  async (data: PlanCreateRequest, { rejectWithValue }) => {
    try {
      return await planService.create(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create plan');
    }
  }
);

export const updatePlan = createAsyncThunk(
  'plans/update',
  async ({ id, data }: { id: number; data: PlanUpdateRequest }, { rejectWithValue }) => {
    try {
      return await planService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update plan');
    }
  }
);

export const deletePlan = createAsyncThunk(
  'plans/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await planService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete plan');
    }
  }
);

const planSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action: any) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearError } = planSlice.actions;
export default planSlice.reducer;