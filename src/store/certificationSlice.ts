import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Certification, CertificationCreateRequest, CertificationUpdateRequest } from '../types/certification';
import { PageResponse, SearchParams } from '../types/common';
import certificationService from '../services/certificationService';

interface CertificationState {
  items: Certification[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: CertificationState = {
  items: [],
  totalElements: 0,
  loading: false,
  error: null,
};

export const fetchCertifications = createAsyncThunk<any, SearchParams | void>(
  'certifications/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await certificationService.getAll(params || undefined);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch certifications');
    }
  }
);

export const createCertification = createAsyncThunk(
  'certifications/create',
  async (data: CertificationCreateRequest, { rejectWithValue }) => {
    try {
      return await certificationService.create(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create certification');
    }
  }
);

export const updateCertification = createAsyncThunk(
  'certifications/update',
  async ({ id, data }: { id: number; data: CertificationUpdateRequest }, { rejectWithValue }) => {
    try {
      return await certificationService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update certification');
    }
  }
);

export const deleteCertification = createAsyncThunk(
  'certifications/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await certificationService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete certification');
    }
  }
);

const certificationSlice = createSlice({
  name: 'certifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertifications.fulfilled, (state, action: any) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchCertifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCertification.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCertification.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteCertification.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export const { clearError } = certificationSlice.actions;
export default certificationSlice.reducer;