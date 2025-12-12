
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/app/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  paidCommunicationFees: string[];
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (fullName: string, email: string, password: string, userType: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  markCommunicationFeePaid: (travelerId: string) => Promise<void>;
  hasPaidCommunicationFee: (travelerId: string) => boolean;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  userType: 'traveler' | 'sender' | 'both';
  avatarUrl?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PAYMENT_STORAGE_KEY = '@travelconnect_paid_fees';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [paidCommunicationFees, setPaidCommunicationFees] = useState<string[]>([]);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      
      // Check for existing session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setIsAuthenticated(false);
        setUser(null);
        setSession(null);
        setIsLoading(false);
        return;
      }
      
      if (session?.user) {
        console.log('User is already authenticated:', session.user.email);
        setSession(session);
        await loadUserProfile(session.user.id);
        setIsAuthenticated(true);
      } else {
        console.log('No active session found');
        setIsAuthenticated(false);
        setUser(null);
        setSession(null);
      }

      // Load payment data
      const paymentData = await AsyncStorage.getItem(PAYMENT_STORAGE_KEY);
      if (paymentData) {
        const paidFees = JSON.parse(paymentData);
        setPaidCommunicationFees(paidFees);
        console.log('Loaded paid communication fees:', paidFees);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
      setPaidCommunicationFees([]);
    } finally {
      setIsLoading(false);
      console.log('Auth check complete');
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading user profile for:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      if (data) {
        const userData: User = {
          id: data.id,
          fullName: data.full_name,
          email: data.email,
          userType: data.user_type as 'traveler' | 'sender' | 'both',
          avatarUrl: data.avatar_url,
        };

        setUser(userData);
        console.log('User profile loaded:', userData.email);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      console.log('Attempting to login user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return { error: error.message };
      }

      if (data.session) {
        console.log('Login successful for:', email);
        setSession(data.session);
        await loadUserProfile(data.user.id);
        setIsAuthenticated(true);
        return {};
      }

      return { error: 'Login failed. Please try again.' };
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const signup = async (fullName: string, email: string, password: string, userType: string): Promise<{ error?: string }> => {
    try {
      console.log('Attempting to signup user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed',
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error.message);
        return { error: error.message };
      }

      if (data.user) {
        console.log('Signup successful for:', email);
        
        // If session is available (email confirmation disabled), set authenticated
        if (data.session) {
          setSession(data.session);
          await loadUserProfile(data.user.id);
          setIsAuthenticated(true);
        }
        
        return {};
      }

      return { error: 'Signup failed. Please try again.' };
    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      await supabase.auth.signOut();
      await AsyncStorage.removeItem(PAYMENT_STORAGE_KEY);
      setUser(null);
      setSession(null);
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
        session,
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
