import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Goal, GoalCreateRequest, GoalUpdateRequest } from '../types/goal';
import { PageResponse, SearchParams } from '../types/common';
import goalService from '../services/goalService';

interface GoalState {
  items: Goal[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: GoalState = {
  items: [],
  totalElements: 0,
  loading: false,
  error: null,
};

export const fetchGoals = createAsyncThunk<any, SearchParams | void>(
  'goals/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await goalService.getAll(params || undefined);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch goals');
    }
  }
);

export const createGoal = createAsyncThunk(
  'goals/create',
  async (data: GoalCreateRequest, { rejectWithValue }) => {
    try {
      return await goalService.create(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create goal');
    }
  }
);

export const updateGoal = createAsyncThunk(
  'goals/update',
  async ({ id, data }: { id: number; data: GoalUpdateRequest }, { rejectWithValue }) => {
    try {
      return await goalService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update goal');
    }
  }
);

export const deleteGoal = createAsyncThunk(
  'goals/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await goalService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete goal');
    }
  }
);

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action: any) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        const idx = state.items.findIndex((g) => g.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => g.id !== action.payload);
      });
  },
});

export const { clearError } = goalSlice.actions;
export default goalSlice.reducer;