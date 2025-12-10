
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  paidCommunicationFees: string[];
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string, userType: string) => Promise<void>;
  logout: () => Promise<void>;
  markCommunicationFeePaid: (travelerId: string) => Promise<void>;
  hasPaidCommunicationFee: (travelerId: string) => boolean;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  userType: 'traveler' | 'sender' | 'both';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@travelconnect_auth';
const PAYMENT_STORAGE_KEY = '@travelconnect_paid_fees';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [paidCommunicationFees, setPaidCommunicationFees] = useState<string[]>([]);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      const paymentData = await AsyncStorage.getItem(PAYMENT_STORAGE_KEY);
      
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

      if (paymentData) {
        const paidFees = JSON.parse(paymentData);
        setPaidCommunicationFees(paidFees);
        console.log('Loaded paid communication fees:', paidFees);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
      setPaidCommunicationFees([]);
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
      await AsyncStorage.removeItem(PAYMENT_STORAGE_KEY);
      setUser(null);
      setIsAuthenticated(false);
      setPaidCommunicationFees([]);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const markCommunicationFeePaid = async (travelerId: string) => {
    try {
      console.log('Marking communication fee as paid for traveler:', travelerId);
      const updatedFees = [...paidCommunicationFees, travelerId];
      await AsyncStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(updatedFees));
      setPaidCommunicationFees(updatedFees);
      console.log('Communication fee marked as paid');
    } catch (error) {
      console.error('Error marking communication fee as paid:', error);
      throw error;
    }
  };

  const hasPaidCommunicationFee = (travelerId: string): boolean => {
    const hasPaid = paidCommunicationFees.includes(travelerId);
    console.log(`Checking if communication fee paid for traveler ${travelerId}:`, hasPaid);
    return hasPaid;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        paidCommunicationFees,
        login,
        signup,
        logout,
        markCommunicationFeePaid,
        hasPaidCommunicationFee,
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
