const API_BASE_URL = process.env.REACT_APP_API_URL;
const R_SERVICE_URL = process.env.REACT_APP_R_SERVICE_URL;

// Advanced Statistics Endpoints
export const fetchAdvancedStats = async (playerId, options = {}) => {
  try {
    const params = new URLSearchParams(options);
    const response = await fetch(
      `${API_BASE_URL}/players/${playerId}/advanced-stats?${params}`
    );
    if (!response.ok) throw new Error('Failed to fetch advanced stats');
    return await response.json();
  } catch (error) {
    console.error('Advanced stats error:', error);
    throw error;
  }
};

export const fetchPitchingPatterns = async (playerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/players/${playerId}/patterns`);
    if (!response.ok) throw new Error('Failed to fetch pitching patterns');
    return await response.json();
  } catch (error) {
    console.error('Patterns error:', error);
    throw error;
  }
};

export const fetchPredictions = async (data) => {
  try {
    const response = await fetch(`${R_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Prediction failed');
    return await response.json();
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
};

export const fetchComparisons = async (playerIds) => {
  try {
    const response = await fetch(`${API_BASE_URL}/players/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerIds }),
    });
    if (!response.ok) throw new Error('Comparison failed');
    return await response.json();
  } catch (error) {
    console.error('Comparison error:', error);
    throw error;
  }
};

export const fetchLeagueAverages = async (season) => {
  try {
    const response = await fetch(`${API_BASE_URL}/league/averages/${season}`);
    if (!response.ok) throw new Error('Failed to fetch league averages');
    return await response.json();
  } catch (error) {
    console.error('League averages error:', error);
    throw error;
  }
};

export default {
  fetchAdvancedStats,
  fetchPitchingPatterns,
  fetchPredictions,
  fetchComparisons,
  fetchLeagueAverages
};