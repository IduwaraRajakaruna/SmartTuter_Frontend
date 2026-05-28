import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/app/lib/mock-data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'student' | 'teacher' | 'admin') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

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
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
