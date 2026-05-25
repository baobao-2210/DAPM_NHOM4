import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

// ============================================================
// MOCK USERS — dùng để test UI khi backend chưa chạy
// Xoá hoặc comment block này khi backend đã sẵn sàng
// ============================================================
const MOCK_USERS = [
  {
    email: 'admin@rescuecar.vn',
    password: '123456',
    user: { _id: 'mock-admin-1', name: 'Admin RescueCar', email: 'admin@rescuecar.vn', phone: '0901111111', role: 'admin' },
    token: 'mock-token-admin',
  },
  {
    email: 'staff@rescuecar.vn',
    password: '123456',
    user: { _id: 'mock-staff-1', name: 'Nhân Viên Demo', email: 'staff@rescuecar.vn', phone: '0902222222', role: 'staff', specialization: 'Kéo xe, Thay lốp' },
    token: 'mock-token-staff',
  },
  {
    email: 'customer@rescuecar.vn',
    password: '123456',
    user: { _id: 'mock-customer-1', name: 'Nguyễn Văn A', email: 'customer@rescuecar.vn', phone: '0903333333', role: 'customer' },
    token: 'mock-token-customer',
  },
];

const mockLogin = (email, password) => {
  const found = MOCK_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (found) return { token: found.token, user: found.user };
  return null;
};
// ============================================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Thử gọi API backend thật
      const res = await axiosClient.post('/auth/login', credentials);
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      // Nếu backend lỗi (không chạy / sai endpoint) → thử mock login
      const isNetworkError = !err.response; // err.response = null khi backend offline
      const isUnauthorized = err.response?.status === 401;
      const isNotFound = err.response?.status === 404;

      if (isNetworkError || isNotFound) {
        // Backend chưa chạy → dùng mock
        const mock = mockLogin(credentials.email, credentials.password);
        if (mock) {
          localStorage.setItem('token', mock.token);
          localStorage.setItem('user', JSON.stringify(mock.user));
          setUser(mock.user);
          return mock.user;
        }
        // Tài khoản không khớp với mock
        throw { response: { data: { message: 'Tài khoản hoặc mật khẩu không đúng (demo: dùng email & password trong ô gợi ý)' } } };
      }

      if (isUnauthorized) {
        // Backend chạy nhưng sai mật khẩu
        throw { response: { data: { message: err.response?.data?.message || 'Email hoặc mật khẩu không đúng' } } };
      }

      // Các lỗi khác (500, 422...) → thử mock fallback
      const mock = mockLogin(credentials.email, credentials.password);
      if (mock) {
        localStorage.setItem('token', mock.token);
        localStorage.setItem('user', JSON.stringify(mock.user));
        setUser(mock.user);
        return mock.user;
      }

      throw err;
    }
  };

  const register = async (data) => {
    try {
      const res = await axiosClient.post('/auth/register-customer', data);
      return res.data;
    } catch (err) {
      // Backend offline → giả lập đăng ký thành công
      if (!err.response) {
        return { message: 'Đăng ký thành công (demo mode)' };
      }
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (newData) => {
    const updated = { ...user, ...newData };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
