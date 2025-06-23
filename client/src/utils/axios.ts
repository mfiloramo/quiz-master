import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api',
  withCredentials: true, // OPTIONAL, ONLY IF NEEDED
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message?.toLowerCase();

    if ((status === 401 || status === 403) && message?.includes('expired')) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
