import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/app/lib/mock-data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'student' | 'teacher' | 'admin') => void;
  logout: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = 'smarttuter.auth.user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storedUser) return;

    try {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
    } catch (error) {
      console.warn('Unable to restore user session', error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) return;
    if (!localStorage.getItem(AUTH_STORAGE_KEY)) {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const login = (email: string, password: string, role: 'student' | 'teacher' | 'admin') => {
    // Mock login - in real app this would call an API
    const mockUser: User = {
      id: role === 'admin' ? 'admin1' : role === 'teacher' ? 't1' : 's1',
      name: role === 'admin' ? 'Admin User' : role === 'teacher' ? 'Teacher' : 'John Smith',
      email,
      role,
      status: 'active',
      joinedDate: new Date().toISOString(),
    };
    setUser(mockUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isInitialized }}>
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
