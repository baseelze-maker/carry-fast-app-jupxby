
import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // For now, we'll always redirect to login
  // Later, you can add logic to check if user is authenticated
  // and redirect to (tabs) if they are
  const isAuthenticated = false; // This will be replaced with actual auth logic

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}
