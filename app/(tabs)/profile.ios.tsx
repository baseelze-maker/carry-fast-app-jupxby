
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";

type TabType = 'trips' | 'deliveries' | 'reviews' | 'settings';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('trips');

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              console.log('Logged out successfully');
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trips':
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.tabContentTitle, { color: theme.colors.text }]}>My Trips</Text>
            <GlassView style={styles.emptyState} glassEffectStyle="regular">
              <IconSymbol 
                ios_icon_name="airplane" 
                android_material_icon_name="flight" 
                size={48} 
                color={theme.dark ? '#98989D' : '#666'} 
              />
              <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>No trips yet</Text>
              <Text style={[styles.emptyStateSubtext, { color: theme.dark ? '#98989D' : '#666' }]}>
                Your upcoming trips will appear here
              </Text>
            </GlassView>
          </View>
        );
      case 'deliveries':
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.tabContentTitle, { color: theme.colors.text }]}>My Deliveries</Text>
            <GlassView style={styles.emptyState} glassEffectStyle="regular">
              <IconSymbol 
                ios_icon_name="shippingbox" 
                android_material_icon_name="local-shipping" 
                size={48} 
                color={theme.dark ? '#98989D' : '#666'} 
              />
              <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>No deliveries yet</Text>
              <Text style={[styles.emptyStateSubtext, { color: theme.dark ? '#98989D' : '#666' }]}>
                Your delivery requests will appear here
              </Text>
            </GlassView>
          </View>
        );
      case 'reviews':
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.tabContentTitle, { color: theme.colors.text }]}>Reviews</Text>
            <GlassView style={styles.emptyState} glassEffectStyle="regular">
              <IconSymbol 
                ios_icon_name="star" 
                android_material_icon_name="star" 
                size={48} 
                color={theme.dark ? '#98989D' : '#666'} 
              />
              <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>No reviews yet</Text>
              <Text style={[styles.emptyStateSubtext, { color: theme.dark ? '#98989D' : '#666' }]}>
                Reviews from other users will appear here
              </Text>
            </GlassView>
          </View>
        );
      case 'settings':
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.tabContentTitle, { color: theme.colors.text }]}>Settings</Text>
            
            {/* Account Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Account</Text>
              
              <TouchableOpacity activeOpacity={0.7}>
                <GlassView style={styles.menuItem} glassEffectStyle="regular">
                  <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                    <IconSymbol 
                      ios_icon_name="person" 
                      android_material_icon_name="person" 
                      size={20} 
                      color={theme.colors.primary} 
                    />
                  </View>
                  <Text style={[styles.menuText, { color: theme.colors.text }]}>Edit Profile</Text>
                  <IconSymbol 
                    ios_icon_name="chevron.right" 
                    android_material_icon_name="chevron-right" 
                    size={20} 
                    color={theme.dark ? '#98989D' : '#666'} 
                  />
                </GlassView>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7}>
                <GlassView style={styles.menuItem} glassEffectStyle="regular">
                  <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                    <IconSymbol 
                      ios_icon_name="checkmark.shield" 
                      android_material_icon_name="verified-user" 
                      size={20} 
                      color={theme.colors.primary} 
                    />
                  </View>
                  <Text style={[styles.menuText, { color: theme.colors.text }]}>Verification</Text>
                  <IconSymbol 
                    ios_icon_name="chevron.right" 
                    android_material_icon_name="chevron-right" 
                    size={20} 
                    color={theme.dark ? '#98989D' : '#666'} 
                  />
                </GlassView>
              </TouchableOpacity>
            </View>

            {/* Preferences Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Preferences</Text>
              
              <TouchableOpacity activeOpacity={0.7}>
                <GlassView style={styles.menuItem} glassEffectStyle="regular">
                  <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                    <IconSymbol 
                      ios_icon_name="bell" 
                      android_material_icon_name="notifications" 
                      size={20} 
                      color={theme.colors.primary} 
                    />
                  </View>
                  <Text style={[styles.menuText, { color: theme.colors.text }]}>Notifications</Text>
                  <IconSymbol 
                    ios_icon_name="chevron.right" 
                    android_material_icon_name="chevron-right" 
                    size={20} 
                    color={theme.dark ? '#98989D' : '#666'} 
                  />
                </GlassView>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7}>
                <GlassView style={styles.menuItem} glassEffectStyle="regular">
                  <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                    <IconSymbol 
                      ios_icon_name="lock" 
                      android_material_icon_name="lock" 
                      size={20} 
                      color={theme.colors.primary} 
                    />
                  </View>
                  <Text style={[styles.menuText, { color: theme.colors.text }]}>Privacy & Security</Text>
                  <IconSymbol 
                    ios_icon_name="chevron.right" 
                    android_material_icon_name="chevron-right" 
                    size={20} 
                    color={theme.dark ? '#98989D' : '#666'} 
                  />
                </GlassView>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7}>
                <GlassView style={styles.menuItem} glassEffectStyle="regular">
                  <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                    <IconSymbol 
                      ios_icon_name="creditcard" 
                      android_material_icon_name="payment" 
                      size={20} 
                      color={theme.colors.primary} 
                    />
                  </View>
                  <Text style={[styles.menuText, { color: theme.colors.text }]}>Payment Methods</Text>
                  <IconSymbol 
                    ios_icon_name="chevron.right" 
                    android_material_icon_name="chevron-right" 
                    size={20} 
                    color={theme.dark ? '#98989D' : '#666'} 
                  />
                </GlassView>
              </TouchableOpacity>
            </View>

            {/* Support Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Support</Text>
              
              <TouchableOpacity activeOpacity={0.7}>
                <GlassView style={styles.menuItem} glassEffectStyle="regular">
                  <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                    <IconSymbol 
                      ios_icon_name="questionmark.circle" 
                      android_material_icon_name="help" 
                      size={20} 
                      color={theme.colors.primary} 
                    />
                  </View>
                  <Text style={[styles.menuText, { color: theme.colors.text }]}>Help Center</Text>
                  <IconSymbol 
                    ios_icon_name="chevron.right" 
                    android_material_icon_name="chevron-right" 
                    size={20} 
                    color={theme.dark ? '#98989D' : '#666'} 
                  />
                </GlassView>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7}>
                <GlassView style={styles.menuItem} glassEffectStyle="regular">
                  <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                    <IconSymbol 
                      ios_icon_name="doc.text" 
                      android_material_icon_name="description" 
                      size={20} 
                      color={theme.colors.primary} 
                    />
                  </View>
                  <Text style={[styles.menuText, { color: theme.colors.text }]}>Terms & Conditions</Text>
                  <IconSymbol 
                    ios_icon_name="chevron.right" 
                    android_material_icon_name="chevron-right" 
                    size={20} 
                    color={theme.dark ? '#98989D' : '#666'} 
                  />
                </GlassView>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity activeOpacity={0.8} onPress={handleLogout}>
              <GlassView style={[styles.logoutButton, { borderColor: '#FF3B30' }]} glassEffectStyle="regular">
                <IconSymbol 
                  ios_icon_name="arrow.right.square" 
                  android_material_icon_name="logout" 
                  size={20} 
                  color="#FF3B30" 
                />
                <Text style={styles.logoutText}>Log Out</Text>
              </GlassView>
            </TouchableOpacity>

            {/* Version */}
            <Text style={[styles.versionText, { color: theme.dark ? '#98989D' : '#666' }]}>Version 1.0.0</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
        </View>

        {/* Profile Card */}
        <GlassView style={styles.profileCard} glassEffectStyle="regular">
          <View style={styles.avatarContainer}>
            <IconSymbol 
              ios_icon_name="person.circle.fill" 
              android_material_icon_name="account-circle" 
              size={60} 
              color={theme.colors.primary} 
            />
            <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: theme.colors.primary }]} activeOpacity={0.7}>
              <IconSymbol 
                ios_icon_name="camera.fill" 
                android_material_icon_name="camera-alt" 
                size={14} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.colors.text }]}>{user?.fullName || 'User'}</Text>
            <Text style={[styles.profileEmail, { color: theme.dark ? '#98989D' : '#666' }]}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>12</Text>
              <Text style={[styles.statLabel, { color: theme.dark ? '#98989D' : '#666' }]}>Trips</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.dark ? '#38383A' : '#E5E5EA' }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>4.8</Text>
              <Text style={[styles.statLabel, { color: theme.dark ? '#98989D' : '#666' }]}>Rating</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.dark ? '#38383A' : '#E5E5EA' }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>8</Text>
              <Text style={[styles.statLabel, { color: theme.dark ? '#98989D' : '#666' }]}>Deliveries</Text>
            </View>
          </View>
        </GlassView>

        {/* Tab Navigation */}
        <GlassView style={styles.tabBar} glassEffectStyle="regular">
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'trips' && styles.activeTab]} 
            onPress={() => setActiveTab('trips')}
            activeOpacity={0.7}
          >
            <IconSymbol 
              ios_icon_name="airplane" 
              android_material_icon_name="flight" 
              size={20} 
              color={activeTab === 'trips' ? theme.colors.primary : (theme.dark ? '#98989D' : '#666')} 
            />
            <Text style={[
              styles.tabText, 
              { color: theme.dark ? '#98989D' : '#666' },
              activeTab === 'trips' && { color: theme.colors.primary, fontWeight: '600' }
            ]}>
              Trips
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeTab === 'deliveries' && styles.activeTab]} 
            onPress={() => setActiveTab('deliveries')}
            activeOpacity={0.7}
          >
            <IconSymbol 
              ios_icon_name="shippingbox" 
              android_material_icon_name="local-shipping" 
              size={20} 
              color={activeTab === 'deliveries' ? theme.colors.primary : (theme.dark ? '#98989D' : '#666')} 
            />
            <Text style={[
              styles.tabText, 
              { color: theme.dark ? '#98989D' : '#666' },
              activeTab === 'deliveries' && { color: theme.colors.primary, fontWeight: '600' }
            ]}>
              Deliveries
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]} 
            onPress={() => setActiveTab('reviews')}
            activeOpacity={0.7}
          >
            <IconSymbol 
              ios_icon_name="star" 
              android_material_icon_name="star" 
              size={20} 
              color={activeTab === 'reviews' ? theme.colors.primary : (theme.dark ? '#98989D' : '#666')} 
            />
            <Text style={[
              styles.tabText, 
              { color: theme.dark ? '#98989D' : '#666' },
              activeTab === 'reviews' && { color: theme.colors.primary, fontWeight: '600' }
            ]}>
              Reviews
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeTab === 'settings' && styles.activeTab]} 
            onPress={() => setActiveTab('settings')}
            activeOpacity={0.7}
          >
            <IconSymbol 
              ios_icon_name="gearshape" 
              android_material_icon_name="settings" 
              size={20} 
              color={activeTab === 'settings' ? theme.colors.primary : (theme.dark ? '#98989D' : '#666')} 
            />
            <Text style={[
              styles.tabText, 
              { color: theme.dark ? '#98989D' : '#666' },
              activeTab === 'settings' && { color: theme.colors.primary, fontWeight: '600' }
            ]}>
              Settings
            </Text>
          </TouchableOpacity>
        </GlassView>

        {/* Tab Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {renderTabContent()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
  },
  profileCard: {
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 12,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'rgba(0, 122, 255, 1)',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  tabContent: {
    flex: 1,
  },
  tabContentTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuItem: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  versionText: {
    fontSize: 13,
    textAlign: 'center',
  },
});
