
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string, userType: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  userType: 'traveler' | 'sender' | 'both';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@travelconnect_auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (authData) {
        const userData = JSON.parse(authData);
        setUser(userData);
        setIsAuthenticated(true);
        console.log('User is already authenticated:', userData.email);
      } else {
        console.log('No auth data found');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('Auth check complete');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Logging in user:', email);
      
      // Simulate API call - In production, this would be a real API call
      // For now, we'll just create a mock user
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        fullName: 'Demo User',
        email: email,
        userType: 'both',
      };

      // Save to AsyncStorage first
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      console.log('User data saved to AsyncStorage');
      
      // Then update state - this will trigger re-render
      setUser(userData);
      setIsAuthenticated(true);
      console.log('Login successful, auth state updated to authenticated');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (fullName: string, email: string, password: string, userType: string) => {
    try {
      console.log('Signing up user:', email);
      
      // Simulate API call - In production, this would be a real API call
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        fullName: fullName,
        email: email,
        userType: userType as 'traveler' | 'sender' | 'both',
      };

      // Save to AsyncStorage first
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      console.log('User data saved to AsyncStorage');
      
      // Then update state - this will trigger re-render
      setUser(userData);
      setIsAuthenticated(true);
      console.log('Signup successful, auth state updated to authenticated');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      setIsAuthenticated(false);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        signup,
        logout,
      }}
    >
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
