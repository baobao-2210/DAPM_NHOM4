import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import axiosClient from '../api/axiosClient';

// Hàm hỗ trợ bóc tách dữ liệu từ JWT
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractUserInfoFromToken = (decoded: any): User => {
  let mappedRole = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'staff';
  mappedRole = mappedRole.toLowerCase();
  if (mappedRole === 'nhanvien') mappedRole = 'staff';
  if (mappedRole === 'khachhang') mappedRole = 'customer';

  return {
    id: decoded.id || decoded.sub || decoded.nameid || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
    email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
    role: mappedRole
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    setRole(null);
  };

  useEffect(() => {
    // Khi khởi động app, đọc token từ localStorage
    const savedToken = localStorage.getItem('access_token');
    if (savedToken) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwtDecode(savedToken);
        // Kiểm tra xem token đã hết hạn chưa
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          logout();
        } else {
          const userInfo = extractUserInfoFromToken(decoded);
          setToken(savedToken);
          setRole(userInfo.role);
          setUser(userInfo);
        }
      } catch (err) {
        console.error("Lỗi giải mã token:", err);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (emailOrPhone: string, password: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await axiosClient.post('/Auth/login', {
        email: emailOrPhone,
        password: password
      });

      if (response && response.token && response.user) {
        localStorage.setItem('access_token', response.token);
        setToken(response.token);

        let mappedRole = response.user.role.toLowerCase();
        if (mappedRole === 'nhanvien') mappedRole = 'staff';
        if (mappedRole === 'khachhang') mappedRole = 'customer';

        const userInfo: User = {
          id: response.user._id.toString(),
          email: response.user.email,
          role: mappedRole
        };

        setUser(userInfo);
        setRole(mappedRole);
        return { success: true, message: 'Đăng nhập thành công' };
      }
      return { success: false, message: 'Tài khoản hoặc mật khẩu không đúng' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login Error:", err);
      // Xử lý lỗi trả về từ API
      const errorMessage = err?.response?.data?.message || `Lỗi kết nối Backend: ${err.message}`;
      return { success: false, message: errorMessage };
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, token, isAuthenticated: !!token, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}