import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // REQUIRED if server uses `credentials: true` in CORS
});

// ADD AUTHORIZATION HEADER IF TOKEN EXISTS
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

// HANDLE RESPONSE ERRORS
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message?.toLowerCase();

    // HANDLE TOKEN EXPIRATION GLOBALLY
    if ((status === 401 || status === 403) && message?.includes('expired')) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
