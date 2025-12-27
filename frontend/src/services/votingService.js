/**
 * Voting Service
 * Handles all voting-related API calls with caching
 */
import api from './api';

// Simple cache with TTL (Time To Live)
const cache = {
  data: {},
  set(key, value, ttl = 30000) { // 30 seconds default
    this.data[key] = {
      value,
      expiry: Date.now() + ttl
    };
  },
  get(key) {
    const item = this.data[key];
    if (!item) return null;
    if (Date.now() > item.expiry) {
      delete this.data[key];
      return null;
    }
    return item.value;
  },
  clear(key) {
    if (key) {
      delete this.data[key];
    } else {
      this.data = {};
    }
  }
};

const votingService = {
  /**
   * Get all positions with candidates
   * @returns {Promise} List of positions
   */
  async getPositions() {
    const cached = cache.get('positions');
    if (cached) return cached;
    
    const response = await api.get('/positions/');
    cache.set('positions', response.data, 60000); // Cache for 1 minute
    return response.data;
  },

  /**
   * Get candidates for a specific position
   * @param {number} positionId - Position ID
   * @returns {Promise} List of candidates
   */
  async getCandidates(positionId = null) {
    const cacheKey = `candidates_${positionId || 'all'}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    const url = positionId ? `/candidates/?position=${positionId}` : '/candidates/';
    const response = await api.get(url);
    cache.set(cacheKey, response.data, 60000); // Cache for 1 minute
    return response.data;
  },

  /**
   * Cast a vote
   * @param {Object} voteData - { candidate, position }
   * @returns {Promise} Vote confirmation
   */
  async castVote(voteData) {
    const response = await api.post('/vote/', voteData);
    // Clear relevant caches after voting
    cache.clear('votingStatus');
    cache.clear('myVotes');
    cache.clear('stats');
    return response.data;
  },

  /**
   * Get user's voting history
   * @returns {Promise} List of user's votes
   */
  async getMyVotes() {
    const cached = cache.get('myVotes');
    if (cached) return cached;
    
    const response = await api.get('/votes/my-votes/');
    cache.set('myVotes', response.data, 30000); // Cache for 30 seconds
    return response.data;
  },

  /**
   * Get voting status (which positions user has voted for)
   * @returns {Promise} Voting status object
   */
  async getVotingStatus() {
    const cached = cache.get('votingStatus');
    if (cached) return cached;
    
    const response = await api.get('/votes/status/');
    cache.set('votingStatus', response.data, 30000); // Cache for 30 seconds
    return response.data;
  },

  /**
   * Get voting results for all positions
   * @returns {Promise} Results object
   */
  async getResults() {
    const cached = cache.get('results');
    if (cached) return cached;
    
    const response = await api.get('/results/');
    cache.set('results', response.data, 15000); // Cache for 15 seconds
    return response.data;
  },

  /**
   * Get results for specific position
   * @param {number} positionId - Position ID
   * @returns {Promise} Position results
   */
  async getPositionResult(positionId) {
    const cacheKey = `result_${positionId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    const response = await api.get(`/results/${positionId}/`);
    cache.set(cacheKey, response.data, 15000); // Cache for 15 seconds
    return response.data;
  },

  /**
   * Get overall voting statistics
   * @returns {Promise} Statistics object
   */
  async getStats() {
    const cached = cache.get('stats');
    if (cached) return cached;
    
    const response = await api.get('/analytics/stats/');
    cache.set('stats', response.data, 30000); // Cache for 30 seconds
    return response.data;
  },
};

export default votingService;
