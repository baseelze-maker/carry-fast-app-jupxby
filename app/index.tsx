
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';

// Refreshed preview
export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('Index screen - Auth state:', { isAuthenticated, isLoading });

  // Show loading spinner while checking auth status
  if (isLoading) {
    console.log('Auth is loading...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    console.log('User is authenticated, redirecting to home');
    return <Redirect href="/(tabs)/(home)" />;
  }

  console.log('User is not authenticated, redirecting to login');
  return <Redirect href="/login" />;
}
