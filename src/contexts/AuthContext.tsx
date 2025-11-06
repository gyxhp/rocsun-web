import { message } from 'antd';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserInfo {
  nickname: string;
  username: string;
  // 可以添加其他用户信息字段
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: (token: string, userInfo: UserInfo) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      // 简单检查token是否过期（实际项目中应该解码JWT检查过期时间）
      const tokenExpiry = localStorage.getItem('authTokenExpiry');
      if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
        logout();
        return;
      }

      setIsAuthenticated(true);

      // 设置token自动过期检查
      const timeout = setTimeout(() => {
        logout();
        message.warning('登录已过期，请重新登录');
      }, 1000 * 60 * 30); // 30分钟后过期

      return () => clearTimeout(timeout);
    };

    checkAuth();
  }, []);

  const login = (token: string, userInfo: UserInfo) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    // 设置token过期时间（30分钟后）
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 30);
    localStorage.setItem('authTokenExpiry', expiry.toISOString());
    setUser(userInfo);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
