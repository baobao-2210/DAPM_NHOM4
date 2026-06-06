import axios from 'axios';

// Đường dẫn tới Backend C# của đồng đội bạn
export const API_BASE_URL = 'http://localhost:54344/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động đính kèm Token khi gọi API
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tự động bóc tách dữ liệu
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Lỗi gọi API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;