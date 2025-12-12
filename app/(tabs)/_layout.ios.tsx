
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <NativeTabs
      tintColor={colors.primary}
      iconColor={colors.text}
      backgroundColor={colors.card}
    >
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="search" name="search">
        <Icon sf="magnifyingglass" />
        <Label>Search</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="trips" name="trips">
        <Icon sf="airplane" />
        <Label>Trips</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="messages" name="messages">
        <Icon sf="message.fill" />
        <Label>Messages</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="profile" name="profile">
        <Icon sf="person.fill" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="search-traveler-details" name="search/traveler-details" hidden />
      <NativeTabs.Trigger key="search-carrier-details" name="search/carrier-details" hidden />
      <NativeTabs.Trigger key="trips-trip-details" name="trips/trip-details" hidden />
      <NativeTabs.Trigger key="notifications" name="notifications" hidden />
    </NativeTabs>
  );
}
