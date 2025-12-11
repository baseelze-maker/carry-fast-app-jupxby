
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
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
      <NativeTabs.Trigger key="notifications" name="notifications">
        <Icon sf="bell.fill" />
        <Label>Notifications</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="messages" name="messages">
        <Icon sf="message.fill" />
        <Label>Messages</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="profile" name="profile">
        <Icon sf="person.fill" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
