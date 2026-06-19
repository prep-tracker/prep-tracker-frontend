import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Subscription, Payment, UpgradeRequest } from '../types/subscription';
import subscriptionService from '../services/subscriptionService';

interface SubscriptionState {
  currentSubscription: Subscription | null;
  payments: Payment[];
  loading: boolean;
  error: string | null;
  upgradeSuccess: boolean;
}

const initialState: SubscriptionState = {
  currentSubscription: null,
  payments: [],
  loading: false,
  error: null,
  upgradeSuccess: false,
};

export const fetchSubscription = createAsyncThunk(
  'subscription/fetchSubscription',
  async (_, { rejectWithValue }) => {
    try {
      return await subscriptionService.getSubscription();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscription');
    }
  }
);

export const upgradeSubscription = createAsyncThunk(
  'subscription/upgradeSubscription',
  async (data: UpgradeRequest, { rejectWithValue }) => {
    try {
      return await subscriptionService.upgradeSubscription(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Upgrade payment failed');
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancelSubscription',
  async (_, { rejectWithValue }) => {
    try {
      return await subscriptionService.cancelSubscription();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel subscription');
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'subscription/fetchPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      return await subscriptionService.getPaymentHistory();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment history');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    resetUpgradeSuccess: (state) => {
      state.upgradeSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subscription
      .addCase(fetchSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Upgrade Subscription
      .addCase(upgradeSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.upgradeSuccess = false;
      })
      .addCase(upgradeSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload;
        state.upgradeSuccess = true;
      })
      .addCase(upgradeSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cancel Subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Payments
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetUpgradeSuccess, clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
