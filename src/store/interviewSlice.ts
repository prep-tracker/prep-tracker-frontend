import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { InterviewTopic, InterviewTopicCreateRequest, InterviewTopicUpdateRequest } from '../types/interview';
import { PageResponse, SearchParams } from '../types/common';
import interviewService from '../services/interviewService';

interface InterviewState {
  items: InterviewTopic[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: InterviewState = {
  items: [],
  totalElements: 0,
  loading: false,
  error: null,
};

export const fetchInterviewTopics = createAsyncThunk<any, SearchParams | void>(
  'interviewTopics/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await interviewService.getAll(params || undefined);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch interview topics');
    }
  }
);

export const createInterviewTopic = createAsyncThunk(
  'interviewTopics/create',
  async (data: InterviewTopicCreateRequest, { rejectWithValue }) => {
    try {
      return await interviewService.create(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create interview topic');
    }
  }
);

export const updateInterviewTopic = createAsyncThunk(
  'interviewTopics/update',
  async ({ id, data }: { id: number; data: InterviewTopicUpdateRequest }, { rejectWithValue }) => {
    try {
      return await interviewService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update interview topic');
    }
  }
);

export const deleteInterviewTopic = createAsyncThunk(
  'interviewTopics/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await interviewService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete interview topic');
    }
  }
);

const interviewSlice = createSlice({
  name: 'interviewTopics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviewTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviewTopics.fulfilled, (state, action: any) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchInterviewTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createInterviewTopic.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateInterviewTopic.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteInterviewTopic.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export const { clearError } = interviewSlice.actions;
export default interviewSlice.reducer;