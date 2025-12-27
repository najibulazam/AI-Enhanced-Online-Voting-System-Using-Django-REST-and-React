/**
 * Authentication Service
 * Handles user registration, login, and JWT token management
 */
import api from './api';

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { student_id, email, nickname, password, password_confirm }
   * @returns {Promise} API response
   */
  async register(userData) {
    const response = await api.post('/auth/register/', userData);
    
    if (response.data.tokens) {
      // Save tokens and user data
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - { student_id, password }
   * @returns {Promise} API response
   */
  async login(credentials) {
    const response = await api.post('/auth/login/', credentials);
    
    if (response.data.tokens) {
      // Save tokens and user data
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Logout user
   * Clears tokens and user data from localStorage
   */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has valid token
   */
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  /**
   * Get user profile from API
   * @returns {Promise} API response with profile data
   */
  async getProfile() {
    const response = await api.get('/auth/profile/');
    return response.data;
  },
};

export default authService;
