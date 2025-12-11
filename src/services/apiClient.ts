import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

export const setAuthToken = (token?: string) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

// Request interceptor to ensure token is always included from localStorage
apiClient.interceptors.request.use(
  (config) => {
    // Check if Authorization header is not already set
    if (!config.headers.Authorization) {
      const accessToken = localStorage.getItem('mm_access');
      if (accessToken && accessToken !== 'cookie-session') {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(undefined);
      localStorage.removeItem('mm_access');
      localStorage.removeItem('mm_refresh');
      localStorage.removeItem('mm_user');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

