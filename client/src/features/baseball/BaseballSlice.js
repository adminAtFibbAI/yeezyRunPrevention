import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPlayerStats, fetchRAnalysis } from './api';

export const fetchStats = createAsyncThunk(
  'baseball/fetchStats',
  async (playerId) => {
    const response = await fetchPlayerStats(playerId);
    return response;
  }
);

export const runRAnalysis = createAsyncThunk(
  'baseball/runRAnalysis',
  async ({ type, data }) => {
    const response = await fetchRAnalysis(type, data);
    return response;
  }
);

const initialState = {
  stats: [],
  rAnalysis: null,
  selectedMetric: 'velocity',
  selectedPlayer: null,
  loading: false,
  error: null,
  viewType: 'stats'
};

const baseballSlice = createSlice({
  name: 'baseball',
  initialState,
  reducers: {
    setSelectedMetric: (state, action) => {
      state.selectedMetric = action.payload;
    },
    setSelectedPlayer: (state, action) => {
      state.selectedPlayer = action.payload;
    },
    setViewType: (state, action) => {
      state.viewType = action.payload;
    },
    clearAnalysis: (state) => {
      state.rAnalysis = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(runRAnalysis.pending, (state) => {
        state.loading = true;
      })
      .addCase(runRAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.rAnalysis = action.payload;
        state.error = null;
      })
      .addCase(runRAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { 
  setSelectedMetric, 
  setSelectedPlayer, 
  setViewType, 
  clearAnalysis 
} = baseballSlice.actions;

export default baseballSlice.reducer;