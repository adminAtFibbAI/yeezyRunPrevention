import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchAdvancedStats, 
  fetchPitchingPatterns,
  fetchPredictions,
  fetchComparisons,
  fetchLeagueAverages
} from '../../services/api';

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAll',
  async (playerId) => {
    const [advancedStats, patterns, leagueAverages] = await Promise.all([
      fetchAdvancedStats(playerId),
      fetchPitchingPatterns(playerId),
      fetchLeagueAverages(new Date().getFullYear())
    ]);

    return {
      advancedStats,
      patterns,
      leagueAverages
    };
  }
);

export const generatePredictions = createAsyncThunk(
  'analytics/predict',
  async (data) => {
    return await fetchPredictions(data);
  }
);

export const comparePlayers = createAsyncThunk(
  'analytics/compare',
  async (playerIds) => {
    return await fetchComparisons(playerIds);
  }
);

const initialState = {
  advancedStats: null,
  patterns: null,
  predictions: null,
  comparisons: null,
  leagueAverages: null,
  loading: false,
  error: null
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.advancedStats = null;
      state.patterns = null;
      state.predictions = null;
      state.comparisons = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.advancedStats = action.payload.advancedStats;
        state.patterns = action.payload.patterns;
        state.leagueAverages = action.payload.leagueAverages;
        state.error = null;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Predictions
      .addCase(generatePredictions.fulfilled, (state, action) => {
        state.predictions = action.payload;
      })
      // Comparisons
      .addCase(comparePlayers.fulfilled, (state, action) => {
        state.comparisons = action.payload;
      });
  }
});

export const { clearAnalytics } = analyticsSlice.actions;

export default analyticsSlice.reducer;