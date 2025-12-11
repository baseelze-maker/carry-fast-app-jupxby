
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { router } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { useAuth } from "@/contexts/AuthContext";

type TabType = 'trips' | 'deliveries' | 'reviews' | 'settings';

export default function ProfileScreen() {
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
            <Text style={styles.tabContentTitle}>My Trips</Text>
            <View style={styles.emptyState}>
              <IconSymbol 
                ios_icon_name="airplane" 
                android_material_icon_name="flight" 
                size={48} 
                color={colors.textSecondary} 
              />
              <Text style={styles.emptyStateText}>No trips yet</Text>
              <Text style={styles.emptyStateSubtext}>Your upcoming trips will appear here</Text>
            </View>
          </View>
        );
      case 'deliveries':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>My Deliveries</Text>
            <View style={styles.emptyState}>
              <IconSymbol 
                ios_icon_name="shippingbox" 
                android_material_icon_name="local-shipping" 
                size={48} 
                color={colors.textSecondary} 
              />
              <Text style={styles.emptyStateText}>No deliveries yet</Text>
              <Text style={styles.emptyStateSubtext}>Your delivery requests will appear here</Text>
            </View>
          </View>
        );
      case 'reviews':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Reviews</Text>
            <View style={styles.emptyState}>
              <IconSymbol 
                ios_icon_name="star" 
                android_material_icon_name="star" 
                size={48} 
                color={colors.textSecondary} 
              />
              <Text style={styles.emptyStateText}>No reviews yet</Text>
              <Text style={styles.emptyStateSubtext}>Reviews from other users will appear here</Text>
            </View>
          </View>
        );
      case 'settings':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Settings</Text>
            
            {/* Account Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>
              
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuIconContainer}>
                  <IconSymbol 
                    ios_icon_name="person" 
                    android_material_icon_name="person" 
                    size={20} 
                    color={colors.primary} 
                  />
                </View>
                <Text style={styles.menuText}>Edit Profile</Text>
                <IconSymbol 
                  ios_icon_name="chevron.right" 
                  android_material_icon_name="chevron-right" 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuIconContainer}>
                  <IconSymbol 
                    ios_icon_name="checkmark.shield" 
                    android_material_icon_name="verified-user" 
                    size={20} 
                    color={colors.primary} 
                  />
                </View>
                <Text style={styles.menuText}>Verification</Text>
                <IconSymbol 
                  ios_icon_name="chevron.right" 
                  android_material_icon_name="chevron-right" 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            {/* Preferences Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuIconContainer}>
                  <IconSymbol 
                    ios_icon_name="bell" 
                    android_material_icon_name="notifications" 
                    size={20} 
                    color={colors.primary} 
                  />
                </View>
                <Text style={styles.menuText}>Notifications</Text>
                <IconSymbol 
                  ios_icon_name="chevron.right" 
                  android_material_icon_name="chevron-right" 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuIconContainer}>
                  <IconSymbol 
                    ios_icon_name="lock" 
                    android_material_icon_name="lock" 
                    size={20} 
                    color={colors.primary} 
                  />
                </View>
                <Text style={styles.menuText}>Privacy & Security</Text>
                <IconSymbol 
                  ios_icon_name="chevron.right" 
                  android_material_icon_name="chevron-right" 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuIconContainer}>
                  <IconSymbol 
                    ios_icon_name="creditcard" 
                    android_material_icon_name="payment" 
                    size={20} 
                    color={colors.primary} 
                  />
                </View>
                <Text style={styles.menuText}>Payment Methods</Text>
                <IconSymbol 
                  ios_icon_name="chevron.right" 
                  android_material_icon_name="chevron-right" 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            {/* Support Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Support</Text>
              
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuIconContainer}>
                  <IconSymbol 
                    ios_icon_name="questionmark.circle" 
                    android_material_icon_name="help" 
                    size={20} 
                    color={colors.primary} 
                  />
                </View>
                <Text style={styles.menuText}>Help Center</Text>
                <IconSymbol 
                  ios_icon_name="chevron.right" 
                  android_material_icon_name="chevron-right" 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuIconContainer}>
                  <IconSymbol 
                    ios_icon_name="doc.text" 
                    android_material_icon_name="description" 
                    size={20} 
                    color={colors.primary} 
                  />
                </View>
                <Text style={styles.menuText}>Terms & Conditions</Text>
                <IconSymbol 
                  ios_icon_name="chevron.right" 
                  android_material_icon_name="chevron-right" 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
              <IconSymbol 
                ios_icon_name="arrow.right.square" 
                android_material_icon_name="logout" 
                size={20} 
                color={colors.error} 
              />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            {/* Version */}
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <IconSymbol 
            ios_icon_name="person.circle.fill" 
            android_material_icon_name="account-circle" 
            size={60} 
            color={colors.primary} 
          />
          <TouchableOpacity style={styles.editAvatarButton} activeOpacity={0.7}>
            <IconSymbol 
              ios_icon_name="camera.fill" 
              android_material_icon_name="camera-alt" 
              size={14} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.fullName || 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
        </View>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'trips' && styles.activeTab]} 
          onPress={() => setActiveTab('trips')}
          activeOpacity={0.7}
        >
          <IconSymbol 
            ios_icon_name="airplane" 
            android_material_icon_name="flight" 
            size={20} 
            color={activeTab === 'trips' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'trips' && styles.activeTabText]}>Trips</Text>
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
            color={activeTab === 'deliveries' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'deliveries' && styles.activeTabText]}>Deliveries</Text>
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
            color={activeTab === 'reviews' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>Reviews</Text>
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
            color={activeTab === 'settings' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  profileCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.card,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  tabContent: {
    flex: 1,
  },
  tabContentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.06)',
    elevation: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  versionText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
