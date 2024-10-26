import { isRejectedWithValue } from '@reduxjs/toolkit';

export const errorMiddleware = (store) => (next) => (action) => {
  // Handle rejected actions
  if (isRejectedWithValue(action)) {
    // Log error
    console.error('API Error:', action.error);

    // Handle specific error types
    switch (action.error.name) {
      case 'AuthenticationError':
        // Handle authentication errors
        window.location.href = '/login';
        break;
      
      case 'RateLimitError':
        // Handle rate limiting
        store.dispatch({
          type: 'error/setError',
          payload: 'Too many requests. Please try again later.'
        });
        break;

      case 'NetworkError':
        // Handle network errors
        store.dispatch({
          type: 'error/setError',
          payload: 'Network connection lost. Please check your connection.'
        });
        break;

      default:
        // Handle general errors
        store.dispatch({
          type: 'error/setError',
          payload: action.error.message || 'An unexpected error occurred.'
        });
    }
  }

  return next(action);
};

export const errorSlice = createSlice({
  name: 'error',
  initialState: {
    message: null,
    showError: false
  },
  reducers: {
    setError: (state, action) => {
      state.message = action.payload;
      state.showError = true;
    },
    clearError: (state) => {
      state.message = null;
      state.showError = false;
    }
  }
});

export const { setError, clearError } = errorSlice.actions;