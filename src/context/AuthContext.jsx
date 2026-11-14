import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.auth
      .me()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await api.auth.login({ email, password });
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await api.auth.register({ name, email, password });
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  const updatePreferredModel = async (model) => {
    await api.auth.updateModel(model);
    setUser((prev) => (prev ? { ...prev, preferredModel: model } : prev));
  };

  const updateProfile = async (data) => {
    const result = await api.auth.updateProfile(data);
    setUser(result.user);
    return result;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updatePreferredModel, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
