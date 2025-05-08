import React, { createContext, useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api';

// Create a hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          logout();
        } else {
          // Set auth token header
          setAuthToken(token);
          // Load user data
          loadUser();
        }
      } catch (err) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user
  const loadUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`);
      setUser(res.data.data);
      setIsAuthenticated(true);
    } catch (err) {
      logout();
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
        await loadUser();
        setError('');
        return res.data;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, userData);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
        await loadUser();
        setError('');
        return res.data;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await axios.put(`${API_URL}/users/${user._id}`, userData);
      if (res.data.success) {
        setUser(res.data.data);
        return res.data;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
      return { success: false, error: err.response?.data?.error || 'Update failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 