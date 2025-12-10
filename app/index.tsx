
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      console.log('Auth is loading...');
      return;
    }

    console.log('Auth state:', { isAuthenticated, segments });

    const inAuthGroup = segments[0] === '(tabs)';

    if (isAuthenticated && !inAuthGroup) {
      console.log('User is authenticated, redirecting to home');
      // Use replace to prevent going back to login
      router.replace('/(tabs)/(home)');
    } else if (!isAuthenticated && inAuthGroup) {
      console.log('User is not authenticated, redirecting to login');
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, segments]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    console.log('Rendering redirect to tabs');
    return <Redirect href="/(tabs)/(home)" />;
  }

  console.log('Rendering redirect to login');
  return <Redirect href="/login" />;
}
