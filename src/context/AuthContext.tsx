import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { login as loginApi, register as registerApi, logout as logoutApi, AuthResponse } from '../services/authService';
import { setAuthToken } from '../services/apiClient';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_KEY = 'mm_access';
const REFRESH_KEY = 'mm_refresh';
const USER_KEY = 'mm_user';

const persist = (payload: AuthResponse) => {
  localStorage.setItem(ACCESS_KEY, payload.tokens.accessToken);
  localStorage.setItem(REFRESH_KEY, payload.tokens.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
};

const loadPersisted = () => {
  const accessToken = localStorage.getItem(ACCESS_KEY);
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  const userJson = localStorage.getItem(USER_KEY);
  const user = userJson ? (JSON.parse(userJson) as User) : null;
  if (accessToken) setAuthToken(accessToken);
  return { accessToken, refreshToken, user };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [{ accessToken, refreshToken, user }, setAuthState] = useState(() => loadPersisted());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const { accessToken: storedToken, user: _storedUser } = loadPersisted();
      if (storedToken && storedToken !== 'cookie-session') {
        // Token exists in localStorage, set it in axios
        setAuthToken(storedToken);
      } else if (!storedToken) {
        // No token in localStorage, check if we have a session cookie
        try {
          const { user } = await import('../services/authService').then(m => m.getMe());
          if (user) {
            setAuthState({ user, accessToken: 'cookie-session', refreshToken: 'cookie-session' });
          }
        } catch (error) {
          // No session, user needs to login
        }
      }
    };
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleAuth = (payload: AuthResponse) => {
    persist(payload);
    setAuthState({ accessToken: payload.tokens.accessToken, refreshToken: payload.tokens.refreshToken, user: payload.user });
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      handleAuth(data);
      enqueueSnackbar('Welcome back!', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Login failed', { variant: 'error' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const data = await registerApi(name, email, password);
      handleAuth(data);
      enqueueSnackbar('Account created', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Registration failed', { variant: 'error' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch (error) {
      console.error('Logout API failed', error);
    } finally {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
      setAuthToken(undefined);
      setAuthState({ accessToken: null, refreshToken: null, user: null });
    }
  };

  const refreshUser = async () => {
    try {
      const { user: updatedUser } = await import('../services/authService').then(m => m.getMe());
      if (updatedUser) {
        setAuthState(prev => ({ ...prev, user: updatedUser }));
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to refresh user', error);
    }
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

