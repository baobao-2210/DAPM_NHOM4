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

// Giả lập backend tạo JWT Token (Base64 encoding đơn giản cho header và payload)
const generateMockToken = (user: User) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    ...user,
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // Hết hạn sau 1 giờ
  }));
  const signature = "mock_signature_for_testing";
  return `${header}.${payload}.${signature}`;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Khi khởi động app, đọc token từ localStorage
    const savedToken = localStorage.getItem('access_token');
    if (savedToken) {
      try {
        const decoded: any = jwtDecode(savedToken);
        // Kiểm tra xem token đã hết hạn chưa
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setToken(savedToken);
          setRole(decoded.role);
          setUser({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
          });
        }
      } catch (err) {
        console.error("Lỗi giải mã token:", err);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (emailOrPhone: string, password: string) => {
    // Giả lập độ trễ mạng
    await new Promise(resolve => setTimeout(resolve, 800));

    // MOCK ĐĂNG NHẬP VỚI 3 TÀI KHOẢN MẪU
    let mockUser: User | null = null;

    if (emailOrPhone === 'admin' && password === 'admin123') {
      mockUser = { id: 'admin-1', email: 'admin@rescue.vn', role: 'admin' };
    } else if (emailOrPhone === 'staff' && password === 'staff123') {
      mockUser = { id: 'staff-1', email: 'staff@rescue.vn', role: 'staff' };
    } else if (emailOrPhone === 'customer' && password === 'customer123') {
      mockUser = { id: 'cust-1', email: 'customer@test.com', role: 'customer' };
    }

    if (mockUser) {
      const jwtToken = generateMockToken(mockUser);
      localStorage.setItem('access_token', jwtToken);
      setToken(jwtToken);
      setUser(mockUser);
      setRole(mockUser.role);
      return { success: true, message: 'Đăng nhập thành công' };
    }

    return { success: false, message: 'Tài khoản hoặc mật khẩu không đúng' };
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, token, isAuthenticated: !!token, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
