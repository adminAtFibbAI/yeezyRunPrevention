import { store } from '../store/store';
import { updateStats, updateAnalytics } from '../features/baseball/baseballSlice';

class RealTimeService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect() {
    this.socket = new WebSocket(process.env.REACT_APP_WS_URL);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  handleMessage(data) {
    switch (data.type) {
      case 'STATS_UPDATE':
        store.dispatch(updateStats(data.payload));
        break;
      
      case 'ANALYTICS_UPDATE':
        store.dispatch(updateAnalytics(data.payload));
        break;

      case 'PITCH_DETECTED':
        this.handleNewPitch(data.payload);
        break;

      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  handleNewPitch(pitchData) {
    // Process new pitch data
    const currentStats = store.getState().baseball.stats;
    const updatedStats = [...currentStats, pitchData];
    
    // Update visualization immediately
    store.dispatch(updateStats(updatedStats));
    
    // Trigger analytics update if needed
    if (this.shouldUpdateAnalytics(pitchData)) {
      this.requestAnalyticsUpdate(updatedStats);
    }
  }

  shouldUpdateAnalytics(pitchData) {
    // Logic to determine if we need to update analytics
    return pitchData.significant || store.getState().baseball.stats.length % 5 === 0;
  }

  async requestAnalyticsUpdate(stats) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats })
      });
      
      if (response.ok) {
        const analytics = await response.json();
        store.dispatch(updateAnalytics(analytics));
      }
    } catch (error) {
      console.error('Analytics update failed:', error);
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
  }

  subscribe(playerId) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'SUBSCRIBE',
        payload: { playerId }
      }));
    }
  }

  unsubscribe(playerId) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'UNSUBSCRIBE',
        payload: { playerId }
      }));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export const realTimeService = new RealTimeService();