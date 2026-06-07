import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

// AuthContext using API
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.role === 'khachhang') parsedUser.role = 'customer';
        if (parsedUser.role === 'nhanvien') parsedUser.role = 'staff';
        if (parsedUser.role === 'admin') parsedUser.role = 'admin';
        setUser(parsedUser);
      } catch {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Thử gọi API backend thật
      const res = await axiosClient.post('/auth/login', credentials);
      const { token, user: userData } = res.data;
      
      // Map roles from backend to frontend
      if (userData.role === 'khachhang') userData.role = 'customer';
      if (userData.role === 'nhanvien') userData.role = 'staff';
      if (userData.role === 'admin') userData.role = 'admin';

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      const isUnauthorized = err.response?.status === 401;
      if (isUnauthorized) {
        throw { response: { data: { message: err.response?.data?.message || 'Email hoặc mật khẩu không đúng' } } };
      }
      throw err;
    }
  };

  const register = async (data) => {
    try {
      const res = await axiosClient.post('/auth/register-customer', data);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (newData) => {
    const updated = { ...user, ...newData };
    sessionStorage.setItem('user', JSON.stringify(updated));
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
