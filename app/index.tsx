
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';

// Refreshed preview
export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  console.log('Index screen - Auth state:', { isAuthenticated, isLoading });

  // Use effect to handle navigation after auth state changes
  useEffect(() => {
    if (!isLoading) {
      console.log('Auth loading complete, isAuthenticated:', isAuthenticated);
      
      if (isAuthenticated) {
        console.log('User is authenticated, navigating to home...');
        // Use a small timeout to ensure the navigation happens after the render
        setTimeout(() => {
          router.replace('/(tabs)/(home)');
        }, 50);
      } else {
        console.log('User is not authenticated, navigating to login...');
        setTimeout(() => {
          router.replace('/login');
        }, 50);
      }
    }
  }, [isAuthenticated, isLoading]);

  // Show loading spinner while checking auth status
  console.log('Rendering loading spinner');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
