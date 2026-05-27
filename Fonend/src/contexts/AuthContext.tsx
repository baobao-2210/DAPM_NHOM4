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

// Hàm hỗ trợ bóc tách dữ liệu từ JWT (Hỗ trợ khi sau này ráp API thật)
const extractUserInfoFromToken = (decoded: any): User => {
  return {
    id: decoded.id || decoded.nameid || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
    email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
    role: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'staff'
  };
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
    // Giả lập độ trễ mạng
    await new Promise(resolve => setTimeout(resolve, 800));

    let mockUser: User | null = null;
    if (emailOrPhone === 'admin' && password === 'admin123') {
      mockUser = { id: 'admin-1', email: 'admin@rescue.vn', role: 'admin' };
    } 
    else if (emailOrPhone === 'customer' && password === 'customer123') {
      mockUser = { id: 'cust-1', email: 'customer@test.com', role: 'customer' };
    }
    else if (emailOrPhone === 'staff1' && password === 'staff123') {
      // ID '2' để gọi xuống Backend C# lấy dữ liệu. Role 'staff' để Router chuyển đúng trang.
      mockUser = { id: '2', email: 'staff1@rescue.vn', role: 'staff' }; 
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