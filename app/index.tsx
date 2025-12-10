
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      console.log('Auth is loading...');
      return;
    }

    console.log('Auth state:', { isAuthenticated });

    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to home');
      router.replace('/(tabs)/(home)');
    } else {
      console.log('User is not authenticated, redirecting to login');
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading]);

  // Show loading spinner while checking auth status
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
