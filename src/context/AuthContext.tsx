'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'FACULTY' | 'STUDENT' | 'VISITOR';
  department?: string | null;
  studentId?: string | null;
  avatar?: string | null;
}

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isFaculty: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    department?: string;
    studentId?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Rehydrate on initial load
  const refreshUser = useCallback(async () => {
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('campus_token') : null;
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
        setToken(storedToken);
      }

      const res = await fetch('/api/auth/me', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.user) {
          setUser(data.data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.data.user);
        setToken(data.data.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('campus_token', data.data.token);
          localStorage.setItem('campus_user', JSON.stringify(data.data.user));
        }
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error during sign in' };
    }
  };

  const register = async (regData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    department?: string;
    studentId?: string;
  }) => {
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.data.user);
        setToken(data.data.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('campus_token', data.data.token);
          localStorage.setItem('campus_user', JSON.stringify(data.data.user));
        }
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error during registration' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      setToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('campus_token');
        localStorage.removeItem('campus_user');
      }
    }
  };

  const isAdmin = user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';
  const isFaculty = user?.role === 'FACULTY' || user?.role === 'STAFF';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        isStudent,
        isFaculty,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

