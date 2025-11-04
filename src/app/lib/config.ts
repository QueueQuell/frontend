// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://queuequell-backend.onrender.com/api',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    // Add other endpoints here as needed
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
