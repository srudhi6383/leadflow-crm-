import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

const DEFAULT_DEMO_USER = {
  id: 'usr_admin',
  _id: 'usr_admin',
  name: 'Alex Morgan',
  email: 'admin@leadflow.ai',
  role: 'Admin',
  title: 'VP of Global Sales',
  phone: '+1 (555) 019-2834',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('leadflow_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return DEFAULT_DEMO_USER;
      }
    }
    return DEFAULT_DEMO_USER;
  });

  const [token, setToken] = useState(() => localStorage.getItem('leadflow_token') || 'demo_jwt_token_2026');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('leadflow_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('leadflow_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('leadflow_token', token);
    } else {
      localStorage.removeItem('leadflow_token');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      if (data.success && data.data) {
        setUser(data.data.user);
        setToken(data.data.token);
        return { success: true, user: data.data.user };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      // Fallback for demo login if server is offline
      const demoUser = { ...DEFAULT_DEMO_USER, email };
      setUser(demoUser);
      setToken('demo_token_' + Date.now());
      return { success: true, user: demoUser };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const data = await authService.register(formData);
      if (data.success && data.data) {
        setUser(data.data.user);
        setToken(data.data.token);
        return { success: true, user: data.data.user };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err) {
      const newUser = {
        id: 'usr_' + Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role || 'User',
        title: formData.title || 'Sales Representative',
        phone: formData.phone || '',
      };
      setUser(newUser);
      setToken('demo_token_' + Date.now());
      return { success: true, user: newUser };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('leadflow_user');
    localStorage.removeItem('leadflow_token');
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUser,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
};
