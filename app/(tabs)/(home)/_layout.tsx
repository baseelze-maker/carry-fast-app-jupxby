
import { Platform } from 'react-native';
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: Platform.OS === 'ios',
          title: 'Home'
        }}
      />
      <Stack.Screen
        name="post-trip"
        options={{
          headerShown: true,
          title: 'Post a Trip',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
