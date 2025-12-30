
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ User signed in:', session.user.email);
        setSession(session);
        await loadUserProfile(session.user);
        // Set authenticated state after profile is loaded (or attempted)
        setIsAuthenticated(true);
        setIsLoading(false);
        console.log('✅ Auth state updated: isAuthenticated = true, isLoading = false');
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        console.log('✅ Auth state updated: isAuthenticated = false');
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('🔄 Token refreshed');
        setSession(session);
      } else if (event === 'USER_UPDATED' && session?.user) {
        console.log('🔄 User updated');
        await loadUserProfile(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking auth status...');
      
      // Check for existing session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error getting session:', error);
        setIsAuthenticated(false);
        setUser(null);
        setSession(null);
        setIsLoading(false);
        return;
      }
      
      if (session?.user) {
        console.log('✅ User is already authenticated:', session.user.email);
        setSession(session);
        await loadUserProfile(session.user);
        setIsAuthenticated(true);
      } else {
        console.log('ℹ️ No active session found');
        setIsAuthenticated(false);
        setUser(null);
        setSession(null);
      }

      // Load payment data
      const paymentData = await AsyncStorage.getItem(PAYMENT_STORAGE_KEY);
      if (paymentData) {
        const paidFees = JSON.parse(paymentData);
        setPaidCommunicationFees(paidFees);
        console.log('💰 Loaded paid communication fees:', paidFees);
      }
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
      setPaidCommunicationFees([]);
    } finally {
      setIsLoading(false);
      console.log('✅ Auth check complete');
    }
  };

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('👤 Loading user profile for:', supabaseUser.id);
      
      // Try to load from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.warn('⚠️ Error loading user profile from database:', error.message);
        console.warn('⚠️ This is likely because the profiles table does not exist yet.');
        console.warn('📝 Creating user profile from auth metadata...');
        
        // Fallback: Create user from auth metadata
        const fallbackUser: User = {
          id: supabaseUser.id,
          fullName: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email || '',
          userType: (supabaseUser.user_metadata?.user_type as 'traveler' | 'sender' | 'both') || 'both',
          avatarUrl: supabaseUser.user_metadata?.avatar_url,
        };

        setUser(fallbackUser);
        console.log('✅ User profile created from metadata:', fallbackUser.email);
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
        console.log('✅ User profile loaded from database:', userData.email);
      }
    } catch (error) {
      console.error('❌ Unexpected error loading user profile:', error);
      
      // Fallback: Create user from auth metadata
      const fallbackUser: User = {
        id: supabaseUser.id,
        fullName: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        userType: (supabaseUser.user_metadata?.user_type as 'traveler' | 'sender' | 'both') || 'both',
        avatarUrl: supabaseUser.user_metadata?.avatar_url,
      };

      setUser(fallbackUser);
      console.log('✅ User profile created from metadata (after error):', fallbackUser.email);
    }
  };

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      console.log('🔐 Attempting to login user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Login error:', error.message);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        return { error: error.message };
      }

      if (data.session && data.user) {
        console.log('✅ Login successful for:', email);
        console.log('✅ Session:', data.session.access_token ? 'Valid token received' : 'No token');
        console.log('✅ User ID:', data.user.id);
        
        // Immediately update the auth state
        setSession(data.session);
        await loadUserProfile(data.user);
        setIsAuthenticated(true);
        setIsLoading(false);
        
        console.log('✅ Auth state immediately updated after login');
        return {};
      }

      console.error('❌ Login failed: No session or user returned');
      return { error: 'Login failed. Please try again.' };
    } catch (error) {
      console.error('❌ Unexpected login error:', error);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const signup = async (fullName: string, email: string, password: string, userType: string): Promise<{ error?: string }> => {
    try {
      console.log('📝 Attempting to signup user:', email);
      
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
        console.error('❌ Signup error:', error.message);
        return { error: error.message };
      }

      if (data.user) {
        console.log('✅ Signup successful for:', email);
        console.log('✅ User ID:', data.user.id);
        
        // If session is available (email confirmation disabled), set authenticated
        if (data.session) {
          console.log('✅ Session available, user can sign in immediately');
          setSession(data.session);
          await loadUserProfile(data.user);
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          console.log('📧 Email confirmation required');
        }
        
        return {};
      }

      console.error('❌ Signup failed: No user returned');
      return { error: 'Signup failed. Please try again.' };
    } catch (error) {
      console.error('❌ Unexpected signup error:', error);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      console.log('👋 Logging out user');
      await supabase.auth.signOut();
      await AsyncStorage.removeItem(PAYMENT_STORAGE_KEY);
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setPaidCommunicationFees([]);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  };

  const markCommunicationFeePaid = async (travelerId: string) => {
    try {
      console.log('💰 Marking communication fee as paid for traveler:', travelerId);
      const updatedFees = [...paidCommunicationFees, travelerId];
      await AsyncStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(updatedFees));
      setPaidCommunicationFees(updatedFees);
      console.log('✅ Communication fee marked as paid');
    } catch (error) {
      console.error('❌ Error marking communication fee as paid:', error);
      throw error;
    }
  };

  const hasPaidCommunicationFee = (travelerId: string): boolean => {
    const hasPaid = paidCommunicationFees.includes(travelerId);
    console.log(`💰 Checking if communication fee paid for traveler ${travelerId}:`, hasPaid);
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
