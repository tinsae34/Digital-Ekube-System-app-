import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, User } from './authService';
import { setApiToken } from './api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (phone: string, password?: string, otp?: string) => Promise<void>;
  register: (phone: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cross-platform helper functions for token/user persistence (web fallback)
const getPersistedToken = (): string | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem('ekube_token');
  }
  return null;
};

const getPersistedUser = (): User | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const uStr = window.localStorage.getItem('ekube_user');
    if (uStr) {
      try {
        return JSON.parse(uStr);
      } catch {
        return null;
      }
    }
  }
  return null;
};

const persistAuthState = (token: string | null, user: User | null) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (token) {
      window.localStorage.setItem('ekube_token', token);
    } else {
      window.localStorage.removeItem('ekube_token');
    }
    if (user) {
      window.localStorage.setItem('ekube_user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('ekube_user');
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = getPersistedToken();
        const savedUser = getPersistedUser();

        if (savedToken) {
          // Set token for API headers
          setApiToken(savedToken);
          
          try {
            // Verify token by requesting current user profile from backend
            const freshUser = await authService.getCurrentUser();
            setUser(freshUser);
            setToken(savedToken);
            persistAuthState(savedToken, freshUser);
          } catch (apiErr) {
            console.warn('Failed to verify token on startup. Clear auth state.', apiErr);
            // If API request fails (e.g. token expired), verify if we should clear or fall back to cached user
            if (savedUser) {
              setUser(savedUser);
              setToken(savedToken);
            } else {
              setApiToken(null);
              persistAuthState(null, null);
            }
          }
        }
      } catch (e) {
        console.error('Failed to load auth state', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (phone: string, password?: string, otp?: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(phone, password, otp);
      setToken(res.token);
      setUser(res.user);
      persistAuthState(res.token, res.user);
    } catch (error) {
      console.error('Context login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (phone: string, password: string, name: string, role: string) => {
    setIsLoading(true);
    try {
      const res = await authService.register(phone, password, name, role);
      setToken(res.token);
      setUser(res.user);
      persistAuthState(res.token, res.user);
    } catch (error) {
      console.error('Context register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setToken(null);
      setUser(null);
      persistAuthState(null, null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
