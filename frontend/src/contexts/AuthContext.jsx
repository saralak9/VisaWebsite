import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, authUtils } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (authUtils.isAuthenticated()) {
        const response = await authAPI.getProfile();
        setUser(response.data.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      authUtils.removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access_token, user_id } = response.data.data;
      
      authUtils.setToken(access_token);
      authUtils.setUserId(user_id);
      
      // Get user profile
      const profileResponse = await authAPI.getProfile();
      setUser(profileResponse.data.data);
      setIsAuthenticated(true);

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { access_token, user_id } = response.data.data;
      
      authUtils.setToken(access_token);
      authUtils.setUserId(user_id);
      
      // Get user profile
      const profileResponse = await authAPI.getProfile();
      setUser(profileResponse.data.data);
      setIsAuthenticated(true);

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    authUtils.removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      
      // Refresh user profile
      const profileResponse = await authAPI.getProfile();
      setUser(profileResponse.data.data);

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Profile update failed' 
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};