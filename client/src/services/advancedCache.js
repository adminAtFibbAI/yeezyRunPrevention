import { LRUCache } from './structures/LRUCache';
import { PriorityQueue } from './structures/PriorityQueue';

class AdvancedCache {
  constructor(options = {}) {
    this.options = {
      maxSize: options.maxSize || 1000,
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes
      cleanupInterval: options.cleanupInterval || 60 * 1000, // 1 minute
      persistToStorage: options.persistToStorage || false,
      compression: options.compression || false
    };

    // Different storage tiers
    this.memory = new LRUCache(this.options.maxSize);
    this.persistent = new Map();
    this.priorityQueue = new PriorityQueue();
    
    // Statistics and monitoring
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      writes: 0
    };

    this.initializeCache();
  }

  initializeCache() {
    // Restore from persistent storage if enabled
    if (this.options.persistToStorage) {
      try {
        const stored = localStorage.getItem('cache-store');
        if (stored) {
          const data = JSON.parse(stored);
          Object.entries(data).forEach(([key, value]) => {
            if (!this.isExpired(value)) {
              this.memory.set(key, value);
            }
          });
        }
      } catch (error) {
        console.error('Cache restoration failed:', error);
      }
    }

    // Start cleanup interval
    setInterval(() => this.cleanup(), this.options.cleanupInterval);
  }

  async set(key, value, options = {}) {
    const {
      priority = 'NORMAL',
      ttl = this.options.ttl,
      tags = [],
      compress = this.options.compression
    } = options;

    try {
      const entry = {
        value: compress ? await this.compress(value) : value,
        timestamp: Date.now(),
        ttl,
        priority,
        tags,
        metadata: {
          hits: 0,
          lastAccessed: Date.now(),
          size: this.calculateSize(value)
        }
      };

      // Add to priority queue
      this.priorityQueue.add(key, this.calculatePriority(entry));

      // Store in memory
      this.memory.set(key, entry);
      
      // Persist if enabled
      if (this.options.persistToStorage) {
        this.persistEntry(key, entry);
      }

      this.stats.writes++;
      return true;
    } catch (error) {
      console.error('Cache set failed:', error);
      return false;
    }
  }

  async get(key, options = {}) {
    const { forceFresh = false } = options;
    const entry = this.memory.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired or force fresh
    if (this.isExpired(entry) || forceFresh) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update statistics
    entry.metadata.hits++;
    entry.metadata.lastAccessed = Date.now();
    this.stats.hits++;

    // Update priority
    this.priorityQueue.update(key, this.calculatePriority(entry));

    // Return decompressed value if necessary
    return entry.value && this.options.compression
      ? await this.decompress(entry.value)
      : entry.value;
  }

  async getMany(keys) {
    return Promise.all(keys.map(async key => ({
      key,
      value: await this.get(key)
    })));
  }

  delete(key) {
    this.memory.delete(key);
    this.priorityQueue.remove(key);
    if (this.options.persistToStorage) {
      this.removeFromStorage(key);
    }
  }

  async clear() {
    this.memory.clear();
    this.priorityQueue.clear();
    if (this.options.persistToStorage) {
      localStorage.removeItem('cache-store');
    }
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      writes: 0
    };
  }

  cleanup() {
    const now = Date.now();
    let evicted = 0;

    this.memory.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        this.delete(key);
        evicted++;
      }
    });

    this.stats.evictions += evicted;
    return evicted;
  }

  // Priority calculation
  calculatePriority(entry) {
    const age = Date.now() - entry.timestamp;
    const accessRecency = Date.now() - entry.metadata.lastAccessed;
    const priorities = { HIGH: 3, NORMAL: 2, LOW: 1 };

    return (
      (entry.metadata.hits * priorities[entry.priority]) /
      (Math.log(age + 1) * Math.log(accessRecency + 1))
    );
  }

  // Advanced features
  async preload(keys) {
    return Promise.all(keys.map(key => this.get(key, { forceFresh: true })));
  }

  async warmup(data) {
    return Promise.all(
      Object.entries(data).map(([key, value]) => this.set(key, value))
    );
  }

  subscribe(key, callback) {
    // Implement pub/sub for cache updates
    if (!this.subscribers) this.subscribers = new Map();
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);
  }

  unsubscribe(key, callback) {
    if (this.subscribers?.has(key)) {
      this.subscribers.get(key).delete(callback);
    }
  }

  // Compression utilities
  async compress(data) {
    if (!this.options.compression) return data;
    try {
      const jsonString = JSON.stringify(data);
      const compressed = await new Response(
        new Blob([jsonString]).stream().pipeThrough(new CompressionStream('gzip'))
      ).blob();
      return compressed;
    } catch (error) {
      console.error('Compression failed:', error);
      return data;
    }
  }

  async decompress(data) {
    if (!this.options.compression) return data;
    try {
      const decompressed = await new Response(
        new Blob([data]).stream().pipeThrough(new DecompressionStream('gzip'))
      ).text();
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('Decompression failed:', error);
      return data;
    }
  }

  // Storage management
  persistEntry(key, entry) {
    try {
      const stored = JSON.parse(localStorage.getItem('cache-store') || '{}');
      stored[key] = entry;
      localStorage.setItem('cache-store', JSON.stringify(stored));
    } catch (error) {
      console.error('Persistence failed:', error);
    }
  }

  removeFromStorage(key) {
    try {
      const stored = JSON.parse(localStorage.getItem('cache-store') || '{}');
      delete stored[key];
      localStorage.setItem('cache-store', JSON.stringify(stored));
    } catch (error) {
      console.error('Storage removal failed:', error);
    }
  }

  // Utility methods
  isExpired(entry) {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  calculateSize(value) {
    // Rough size estimation in bytes
    return new Blob([JSON.stringify(value)]).size;
  }

  getStats() {
    return {
      ...this.stats,
      size: this.memory.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
      memoryUsage: this.memory.getSize()
    };
  }
}

// Supporting data structures
export class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }

  getSize() {
    return Array.from(this.cache.values()).reduce(
      (size, entry) => size + entry.metadata.size,
      0
    );
  }
}

export class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  add(key, priority) {
    this.queue.push({ key, priority });
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  update(key, newPriority) {
    const index = this.queue.findIndex(item => item.key === key);
    if (index !== -1) {
      this.queue[index].priority = newPriority;
      this.queue.sort((a, b) => b.priority - a.priority);
    }
  }

  remove(key) {
    this.queue = this.queue.filter(item => item.key !== key);
  }

  getHighestPriority() {
    return this.queue[0]?.key;
  }

  clear() {
    this.queue = [];
  }
}

// Export instance
export const advancedCache = new AdvancedCache({
  maxSize: 1000,
  ttl: 5 * 60 * 1000,
  persistToStorage: true,
  compression: true
});

// Redux middleware
export const cacheMiddleware = store => next => action => {
  if (action.meta?.cache === false) {
    return next(action);
  }

  const cacheKey = `${action.type}_${JSON.stringify(action.payload)}`;
  const cachedValue = advancedCache.get(cacheKey);

  if (cachedValue) {
    return Promise.resolve(cachedValue);
  }

  const result = next(action);

  if (result instanceof Promise) {
    result.then(value => {
      advancedCache.set(cacheKey, value, {
        priority: action.meta?.priority || 'NORMAL',
        ttl: action.meta?.ttl,
        tags: action.meta?.tags
      });
    });
  }

  return result;
};