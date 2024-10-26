import { store } from '../store/store';
import { enhancedCache } from './advancedCache';

class ErrorRecoveryService {
  constructor() {
    this.retryQueue = new Map();
    this.failureHandlers = new Map();
    this.maxRetries = 3;
    this.backoffMultiplier = 1.5;
    this.initialRetryDelay = 1000;
  }

  // Register failure handlers for different error types
  registerFailureHandler(errorType, handler) {
    this.failureHandlers.set(errorType, handler);
  }

  async handleError(error, context) {
    console.error('Error occurred:', error, 'Context:', context);

    // Check for specific error types
    const handler = this.failureHandlers.get(error.type);
    if (handler) {
      return handler(error, context);
    }

    // Default error handling strategy
    switch (error.code) {
      case 'NETWORK_ERROR':
        return this.handleNetworkError(error, context);
      case 'API_ERROR':
        return this.handleAPIError(error, context);
      case 'CACHE_ERROR':
        return this.handleCacheError(error, context);
      case 'WEBSOCKET_ERROR':
        return this.handleWebSocketError(error, context);
      default:
        return this.handleGenericError(error, context);
    }
  }

  async handleNetworkError(error, context) {
    // Attempt to serve from cache
    const cachedData = enhancedCache.get(context.cacheKey);
    if (cachedData) {
      store.dispatch({
        type: 'status/setWarning',
        payload: 'Using cached data due to network issues'
      });
      return cachedData;
    }

    // Queue for retry
    return this.queueForRetry(context);
  }

  async handleAPIError(error, context) {
    if (error.status === 429) {
      // Rate limiting - implement exponential backoff
      const retryAfter = parseInt(error.headers.get('Retry-After')) || 5;
      return this.scheduleRetry(context, retryAfter * 1000);
    }

    if (error.status >= 500) {
      // Server error - attempt retry with backoff
      return this.queueForRetry(context);
    }

    // Client error - handle accordingly
    store.dispatch({
      type: 'error/setError',
      payload: {
        message: error.message,
        severity: 'error',
        action: this.getErrorAction(error)
      }
    });
  }

  async handleCacheError(error, context) {
    // Clear problematic cache entries
    enhancedCache.evict(context.cacheKey);
    
    // Attempt to fetch fresh data
    return this.retryOperation(context);
  }

  async handleWebSocketError(error, context) {
    // Attempt to reconnect WebSocket
    store.dispatch({ type: 'websocket/reconnect' });
    
    // Fall back to polling if necessary
    return this.fallbackToPolling(context);
  }

  async queueForRetry(context, customBackoff = null) {
    const retryCount = this.retryQueue.get(context.id)?.retryCount || 0;
    
    if (retryCount >= this.maxRetries) {
      return this.handleMaxRetriesExceeded(context);
    }

    const delay = customBackoff || this.calculateBackoff(retryCount);
    
    this.retryQueue.set(context.id, {
      context,
      retryCount: retryCount + 1,
      nextRetry: Date.now() + delay
    });

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const result = await this.retryOperation(context);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }

  calculateBackoff(retryCount) {
    return this.initialRetryDelay * Math.pow(this.backoffMultiplier, retryCount);
  }

  async retryOperation(context) {
    // Implement the retry logic
    try {
      const result = await context.operation();
      this.retryQueue.delete(context.id);
      return result;
    } catch (error) {
      return this.handleError(error, context);
    }
  }

  async handleMaxRetriesExceeded(context) {
    // Notify user and provide alternatives
    store.dispatch({
      type: 'error/setError',
      payload: {
        message: 'Operation failed after multiple attempts',
        severity: 'error',
        alternatives: this.getAlternatives(context)
      }
    });

    // Attempt to recover or provide fallback
    return this.provideFallback(context);
  }

  getAlternatives(context) {
    // Return context-specific alternatives
    switch (context.type) {
      case 'data-fetch':
        return ['Use cached data', 'Try again later', 'Load backup data'];
      case 'analysis':
        return ['Use simplified analysis', 'Load previous analysis', 'Skip analysis'];
      default:
        return ['Retry', 'Cancel', 'Report issue'];
    }