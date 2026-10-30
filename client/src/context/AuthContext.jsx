import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);
const TOKEN_KEY = 'pixelvault-token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem('pixelvault-user'));
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(Boolean(window.localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    api.get('/auth/me')
      .then(({ data }) => {
        setUser(data.user);
        window.localStorage.setItem('pixelvault-user', JSON.stringify(data.user));
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem('pixelvault-user');
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const saveSession = (data) => {
    window.localStorage.setItem(TOKEN_KEY, data.token);
    window.localStorage.setItem('pixelvault-user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const signIn = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return saveSession(data);
  };

  const signUp = async (details) => {
    const { data } = await api.post('/auth/register', details);
    return saveSession(data);
  };

  const signOut = () => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem('pixelvault-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}