'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'admin';
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      // 检查是否存在认证令牌
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='));
      
      if (authToken) {
        // 从认证令牌中解析用户信息（在实际应用中，这应该是JWT）
        // 这里我们简化处理，直接从cookie中获取用户ID
        const userId = authToken.split('=')[1].split('|')[0]; // 格式: userId|timestamp
        if (userId) {
          const response = await fetch(`/api/users/${userId}`);
          
          if (response.ok) {
            const userData = await response.json();
            console.log("获取到用户数据:", userData);
            setUser(userData);
          } else {
            console.log("获取用户数据失败，状态码:", response.status);
            // 如果获取用户数据失败，清除认证令牌
            document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            setUser(null);
          }
        }
      }
    } catch (error) {
      console.error('检查认证状态时出错:', error);
      // 如果检查认证状态时出错，清除认证令牌
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { user: userData } = await response.json();
        console.log("登录成功，用户数据:", userData);
        setUser(userData);
        
        // 设置认证令牌，格式为 userId|timestamp
        const authToken = `${userData.id}|${Date.now()}`;
        document.cookie = `auth-token=${authToken}; path=/; max-age=3600`; // 1小时过期
        
        return { success: true };
      } else {
        const errorData = await response.json();
        console.log("登录失败:", errorData);
        return { success: false, message: errorData.message };
      }
    } catch (error) {
      console.error('登录错误:', error);
      return { success: false, message: '无法连接到服务器' };
    }
  };

  const logout = () => {
    console.log("执行登出操作");
    setUser(null);
    // 清除认证令牌
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/login');
  };

  // 添加一个useEffect来监听user状态的变化
  useEffect(() => {
    console.log("用户状态更新:", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
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